/* This example requires Tailwind CSS v2.0+ */
import React, {Fragment, useEffect, useRef, useState} from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {BellIcon, HomeIcon, MenuIcon, XIcon} from '@heroicons/react/outline'
import {useMoralisWeb3Api} from "react-moralis";
import Chartjs from "chart.js/auto";

const chartColors = [
  "#336699",
  "#99CCFF",
  "#999933",
  "#666699",
  "#CC9933",
  "#006666",
  "#3399FF",
  "#993300",
  "#CCCC99",
  "#666666",
  "#FFCC66",
  "#6699CC",
  "#663366",
  "#9999CC",
  "#CCCCCC",
  "#669999",
  "#CCCC66",
  "#CC6600",
  "#9999FF",
  "#0066CC",
  "#99CCCC",
  "#999999",
  "#FFCC00",
  "#009999",
  "#99CC33",
  "#FF9900",
  "#999966",
  "#66CCCC",
  "#339966",
  "#CCCC33",
  "#003f5c",
  "#665191",
  "#a05195",
  "#d45087",
  "#2f4b7c",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
  "#EF6F6C",
  "#465775",
  "#56E39F",
  "#59C9A5",
  "#5B6C5D",
  "#0A2342",
  "#2CA58D",
  "#84BC9C",
  "#CBA328",
  "#F46197",
  "#DBCFB0",
  "#545775"
];

let i = 0;

const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0");

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const baseURL = "https://eth-mainnet.alchemyapi.io/nft/v2/rpgRyd5BBElsZ8OaDerQFRH3ZfXIb_nw/getOwnersForCollection/";
const baseURL1 = "https://api.reservoir.tools/users/"
const baseURL2 = "https://api.opensea.io/api/v1/collections";
const baseURL3 = "https://api.opensea.io/api/v1/collection";
const baseURL4 = " https://api.covalenthq.com/v1/1/nft_market/collection";
const fetchURL1 = `${baseURL}?contractAddress=0xbd4455da5929d5639ee098abfaa3241e9ae111af`;
const fetchURL2 = `${baseURL}?contractAddress=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`;
const fetchURL3 = `${baseURL}?contractAddress=0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`;
//const fetchURL3 = `${baseURL1}0x3572DB2E377a4efECa5CBd58A241979C7Cdb00aE/collections/v2?collection=0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD&includeTopBid=false&offset=0`;
//const fetchURL4 = `${baseURL4}/0xbd4455da5929d5639ee098abfaa3241e9ae111af/?&key=ckey_b7d4ed5a9a1a40b79ff9a65e8c4`;
const req = new Request(fetchURL1)

export default function App() {
  const [wallets, setWallets] = useState(null);
  const [wallets0, setWallets0] = useState(null);
  const [balances, setBalances] = useState(null);
  const [gases, setGases] = useState(null);
  const [prices, setPrices] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccount1, setCurrentAccount1] = useState(null);
  const [txs, setTxs] = useState(null);
  const [txPrice, setTxPrice] = useState(null);
  const [txName, setTxName] = useState(null);
  const [owners, setOwners] = useState(null);
  const [amount, setAmount] = useState(null);
  const Web3Api = useMoralisWeb3Api();

  //  const checkWalletIsConnected = async () => {
  //    const { ethereum } = window;
  //
  //    if (!ethereum) {
  //      console.log("Make sure you have Metamask installed!");
  //      return;
  //    } else {
  //      console.log("Wallet exists! We're ready to go!")
  //    }
  //  }

  async function fetchWallet() {
    const {ethereum} = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    if (ethereum) {

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsLoading((currentAccount) => !currentAccount);

        fetch(`${baseURL2}?asset_owner=${accounts[0]}&offset=0&limit=300`)
          .then(resp => resp.json())
          .then(data => {
            //console.log(data)
            setWallets0(data.length);
            const responses = data.map((data) =>
              fetch(`${baseURL3}/${data.slug}`)
                .then((res) => res.json()),
        );
          Promise.all(responses)
              .then(fetchedOrders => {
                fetchedOrders.sort(function (x, y) {
                  return y.collection.stats.floor_price - x.collection.stats.floor_price;
                })

                let addy = fetchedOrders.map((item, i) => Object.assign({}, item, fetchedOrders[i].collection.primary_asset_contracts))
                let addys = fetchedOrders.map((item, i) => Object.assign({}, item, addy[i][0]))
                //let merged = addys.map(({address})=>[address]).flat(1);
                let xAddress = addys.filter(x => x.address !== undefined)
                //xAddress.pop()

                //console.log(xAddress);
                setFilterData(xAddress);
                setWallets(xAddress);
              });
          });

        // get ENS domain of an address
        const options = { address: accounts[0] };
        const resolve = await Moralis.Web3API.resolve.resolveAddress(options);
        //console.log(resolve.name);
        setCurrentAccount1(resolve.name)

      } catch (err) {
        console.log(err);
      }

    } else {
      console.log("Ethereum object does not exist");
    }
  }

  async function fetchStats() {
    const {ethereum} = window;

    if (ethereum) {

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        let balance = await web3.eth.getBalance(accounts[0]) / 10 ** 18;
        //console.log(balance.toFixed(2))
        setBalances(balance.toFixed(2))

        let gas = await web3.eth.getGasPrice() / 10 ** 9;
        //console.log(gas.toFixed(0))
        setGases(gas.toFixed(0))

        let data = await CoinGeckoClient.coins.fetch('ethereum', {});
        //console.log(data.data.market_data.current_price.usd)
        setPrices(data.data.market_data.current_price.usd)

      } catch (err) {
        console.log(err);
      }
    }
  }


  async function fetchTx() {
    const {ethereum} = window;

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const transfersNFT = await Web3Api.account.getNFTTransfers({ address: accounts[0] });
        //console.log(transfersNFT.result);
        //setTxs(transfersNFT.result[0].token_address)
        for (i=i; i<transfersNFT.result.length; i++) {
          setTxPrice(transfersNFT.result[i].value)
          //setTxTime(transfersNFT.result[i].block_timestamp)
          //console.log(transfersNFT.result[i]);

          fetch(`https://api.reservoir.tools/collection/v2?id=${transfersNFT.result[0].token_address}`)
          .then(resp => resp.json())
          .then(data => {
            //console.log(data.collection)
            setTxs(data.collection.metadata.imageUrl)
            setTxName(data.collection.name)
          });
        }

      } catch (err) {
        console.log(err);
      }

  }

  const searchByName = (event) => {
    event.persist();
    // Get the search term
    const searchItem = event.target.value.trim();
    // If search term is empty fill with full students data
    if(!searchItem.trim()) {
      setFilterData(wallets);
    }

    // Search the name and if it found return the same array
    const searchIn = (title) => {
      if(title?.indexOf(searchItem) !== -1) {
        return true;
      }
      return false;
    };

    if (Array.isArray(wallets)) {
      const result2 = wallets.filter(item => item);
      console.log('arr is an array');
    } else {
      console.log('arr is not an array');
    }

    // Filter the array
    const filteredData = wallets.filter((item) => {
      return searchIn(item.name);
    });

    // Set the state with filtered data
    setFilterData(filteredData);
  }

  const stats = [
      { name: 'Wallet Balance (eth)', stat: balances },
      { name: 'Total NFT Collections', stat: wallets0 },
      { name: 'Eth Price', stat: prices },
      { name: 'Gas (gwei)', stat: gases },
  ]

  const stats1 = [
      { name: txName, stat: txs, stat1: txPrice / 10**18 },
  ]

  useEffect(() => {
    fetchWallet()
  }, [])

  useEffect(() => {
    fetchStats()
    const interval=setInterval(()=>{
      fetchStats()
     },5000)
     return()=>clearInterval(interval)
  }, [gases, prices])

  useEffect(() => {
    fetchTx()
  }, [])

  return (
      <>
        {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
        <div className="min-h-full">
          <Disclosure as="nav" className="bg-gray-800">
            {({open}) => (
                <>
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center">
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          <button
                              type="button"
                              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                          >
                            <span className="sr-only">View notifications</span>
                              <h1 className="text-md font-bold text-white-900">{currentAccount1 || currentAccount}</h1>
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 right-0 hover:text-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only ">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6 absolute inset-y-7 right-0" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6 absolute inset-y-7 right-0" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  <Disclosure.Panel className="border-b border-gray-700 md:hidden absolute inset-y-0 right-0">
                    <div className="px-2 py-12 space-y-1 sm:px-3 absolute inset-y-0 right-0">
                        <Disclosure.Button>
                          {currentAccount1 || currentAccount}
                        </Disclosure.Button>
                    </div>
                  </Disclosure.Panel>
                </>
            )}
          </Disclosure>

          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div>
                  <div>
                    <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                      {stats.map((item) => (
                        <div key={item.name} className="px-4 py-5 bg-gray-700 shadow rounded-lg overflow-hidden sm:p-6">
                          <dt className="text-sm font-medium text-white truncate">{item.name}</dt>
                          <dd className="mt-1 text-3xl font-semibold text-white">{item.stat}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="py-4">
                  <div>
                    <table className="min-w-full divide-x divide-gray-200">
                      {stats1 && stats1.map((item, index) => {

                        return(
                          <tbody key={index} className="bg-gray-800">
                            <tr className={stats1 % 2 === 0 ? 'bg-white' : 'bg-gray-700'}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                <img
                                    className="inline-block h-20 w-20"
                                    src={item.stat}
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                <td className="font-bold">Latest Transaction</td>
                                {item.name}
                                <td className="font-bold">Current Price</td>
                                {item.stat1}
                              </td>
                            </tr>
                          </tbody>
                        )}
                      )}
                    </table>
                  </div>
                  <div className="">
                      <div className="flex flex-col">
                        <div className="search" id="search">
                          <div>
                            <div>
                              <div><strong>Search</strong></div>
                            </div>
                          </div>
                          <input type="text " className="searchByName rounded-lg py-2 min-w-full" onChange={(e) => searchByName(e)} ></input>
                        </div>

                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-1">
                          <div className="my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
                            <div className="py-2 align-middle h-96 min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
                              <div className="shadow sm:rounded-sm">
                                <div className="grid grid-cols-4 gap-1">

                                    {filterData && filterData.map((wallet, index) => {
                                      const floor = wallet.collection.stats.floor_price;
                                      //console.log(wallet.address)
                                      const v = wallet.collection.stats.total_volume;
                                      const volume = v.toFixed(2)

                                      const y = wallet.collection.image_url
                                      //const z = wallet.collection.
                                      //console.log(w)

                                      //const onButtonClick = () => {
                                        //const data = [[wallet.collection.stats.total_supply-wallet.tokenCount], wallet.tokenCount];
                                        //updateDataset(0, data);
                                      //};

                                      const onButtonClick = () => {
                                        setLoading(true)

                                        const url1 = `${baseURL}?contractAddress=${wallet.address}`
                                        const url2 = fetchURL2
                                        const url3 = fetchURL3

                                        const urls = [
                                            url1,
                                            url2,
                                        ];

                                        const urls2 = [
                                            url1,
                                            url3,
                                        ];

                                        Promise.all(
                                            urls.map(url =>
                                                fetch(url)
                                                    .then(res => res.json())
                                                    .then(res => res.ownerAddresses)
                                            ))
                                            .then(data => {

                                              //console.log(data)
                                              let arrIntersection = data[0].filter((a) => {
                                                return data[1].includes(a)
                                              }).map(item => ({ownerAddress: item}))

                                              if (arrIntersection.length !== 0) {
                                                //console.log(arrIntersection)
                                                const responses = arrIntersection.map((arrIntersection) =>
                                                    fetch(`${baseURL1}${arrIntersection.ownerAddress}/collections/v2?collection=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&includeTopBid=false&offset=0`)
                                                        .then((res) => res.json()),
                                                );
                                                Promise.all(responses)
                                                    .then(fetchedOrders => {
                                                      //console.log(fetchedOrders)
                                                      let merged = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].ownership));
                                                      merged.sort(function (x, y) {
                                                        return y.tokenCount - x.tokenCount;
                                                      })
                                                      //console.log(merged)

                                                      setOwners(merged.length)

                                                      let sum = merged.reduce(function (prev, current) {
                                                        return prev + +current.tokenCount
                                                      }, 0);
                                                      //console.log(sum)

                                                      let mergedOwner = merged.map(({ownerAddress})=>[ownerAddress]).flat(1);
                                                      let mergedToken = merged.map(({tokenCount})=>[tokenCount]).flat(1);
                                                      let mergedCount = mergedToken.map(Number)
                                                      mergedCount.unshift(sum)

                                                      let merged1 = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].collection));
                                                      let distribution = [].concat([merged1[0].tokenCount - sum], sum).map(Number);
                                                      //console.log(mergedCount[0]);
                                                      //let distribution1 = distribution[0] / 10000
                                                      //console.log(distribution1);

                                                      setAmount(distribution[1])

                                                      let ctx = document.getElementById("myChart").getContext('2d');

                                                      const tmpChart = Chartjs.getChart('myChart');
                                                      if (tmpChart) {
                                                        tmpChart.destroy()
                                                      }

                                                      new Chartjs(ctx,{
                                                        type: "bar",
                                                        data: {
                                                          labels: mergedOwner,
                                                          datasets: [
                                                              {
                                                                label: `${mergedCount[0]} Ape/(s) Owned`,
                                                                data: mergedToken,
                                                                backgroundColor: chartColors,
                                                                hoverBackgroundColor: chartColors
                                                              }
                                                              ]
                                                        },
                                                        options: {
                                                          indexAxis: 'y',
                                                          // Elements options apply to all of the options unless overridden in a dataset
                                                          // In this case, we are setting the border of each horizontal bar to be 2px wide
                                                          elements: {
                                                            bar: {
                                                              borderWidth: 2,
                                                            }
                                                          },
                                                          responsive: true,
                                                          plugins: {
                                                            legend: {
                                                              position: 'right',
                                                            },
                                                            title: {
                                                              display: true,
                                                              text: `${mergedCount[0]} Ape/(s) owned by ${wallet.collection.slug} holders`
                                                            }
                                                          }
                                                        },
                                                      });

                                                      //new Chartjs(ctx,{
                                                      //  type: "pie",
                                                      //  data: {
                                                        //  labels: [`Apes held from others`, `Apes held from ${wallet.collection.slug}`],
                                                        //  datasets: [
                                                        //      {
                                                        //        data: distribution,
                                                        //        backgroundColor: chartColors,
                                                        //        hoverBackgroundColor: chartColors
                                                        //      }
                                                        //      ]
                                                        //},
                                                      //});

                                                    });
                                                setLoading(false)
                                              }
                                            })
                                        //console.log(floor)
                                      };

                                    return(
                                      <div className="wallet " key={index}>
                                        <div className={filterData % 2 === 0 ? 'bg-white' : 'bg-gray-50 transition ease-in-out delay-150 duration-300 px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-8' }>
                                          <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                                            <button onClick={onButtonClick} disabled={loading}>
                                              <img
                                                  className="inline-block h-40 w-40"
                                                  src={y}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                    )}
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            {
                              (loading)
                              ?
                              <svg
                                  role="status"
                                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                  viewBox="0 0 100 101" fill="none">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                              </svg>
                              :
                              <canvas id="myChart" />
                            }
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
              {/* /End replace */}
            </div>
          </main>
        </div>
      </>
  )
}