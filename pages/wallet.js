/* This example requires Tailwind CSS v2.0+ */
import React, {useContext, useEffect, useState} from 'react'
import {useMoralisWeb3Api, useNewMoralisObject} from "react-moralis";
import Chartjs from "chart.js/auto";
import * as helpers from 'chart.js/helpers';
import {
  TreemapController,
  TreemapElement
} from '../node_modules/chartjs-chart-treemap/dist/chartjs-chart-treemap.esm.js';
import {useRouter} from "next/router";
import {app} from "../services/server";
import {getAuth} from "firebase/auth";
import {MultipleContext} from "./Contexts/MultipleContext";
import AppContainer from "./App";

Chartjs.register(TreemapController, TreemapElement);

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
const baseURL4 = "https://api.covalenthq.com/v1/1/nft_market/collection";
const fetchURL1 = `${baseURL}?contractAddress=0xbd4455da5929d5639ee098abfaa3241e9ae111af`;
const fetchURL2 = `${baseURL}?contractAddress=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`;
const fetchURL3 = `${baseURL}?contractAddress=0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`;
const fetchURL4 = `${baseURL}?contractAddress=0x23581767a106ae21c074b2276D25e5C3e136a68b`;
//const fetchURL3 = `${baseURL1}0x3572DB2E377a4efECa5CBd58A241979C7Cdb00aE/collections/v2?collection=0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD&includeTopBid=false&offset=0`;
//const fetchURL4 = `${baseURL4}/0xbd4455da5929d5639ee098abfaa3241e9ae111af/?&key=ckey_b7d4ed5a9a1a40b79ff9a65e8c4`;
const req = new Request(fetchURL1)

function Spinner() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default function Wallet() {
  const [wallets, setWallets] = useState(null);
  const [wallets0, setWallets0] = useState(null);
  const [balances, setBalances] = useState(null);
  const [gases, setGases] = useState(null);
  const [prices, setPrices] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [amountOwned, setAmountOwned] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccount1, setCurrentAccount1] = useState(null);
  const [txs, setTxs] = useState(null);
  const [txPrice, setTxPrice] = useState(null);
  const [txName, setTxName] = useState(null);
  const [owners, setOwners] = useState(null);
  const [amount, setAmount] = useState(null);
  const [object, setObject] = useState(null);
  const Web3Api = useMoralisWeb3Api();
  const {save} = useNewMoralisObject("merged");
  const router = useRouter();
  const auth = getAuth(app);
  const {user, setUser}  = useContext(MultipleContext)
  const {userA, setUserA}  = useContext(MultipleContext)
  const [showChart, setShowChart] = useState(false);

  //console.log(user)

  useEffect(() => {
    if (!userA) router.push("/dashboard");
  }, [!userA]);

  async function logout() {
    await auth.signOut();
    setUserA(null);
  }

  async function fetchWallet(props) {

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Found an account! Address: ${accounts[0]}`);

      setCurrentAccount(accounts[0]);
      setIsLoading(true);

      const response = await fetch(`${baseURL2}?asset_owner=${accounts[0]}&offset=0&limit=300`);
      const data = await response.json();

      //console.log(data)

      //console.log(data.map(item => item.owned_asset_count));
      //const amountOwned = data.reduce((i, item) => item[i].owned_asset_count, 0);

      //console.log()

      setAmountOwned(data.map(item => item.owned_asset_count))
      setWallets0(data.length);

      const responses = data.map((data) =>
              fetch(`${baseURL3}/${data.slug}`)
                  .then((res) => res.json()),
      );
        Promise.all(responses)
          .then(fetchedOrders => {
            fetchedOrders.forEach(order => {
              const matchingObject = data.find(dataObj => dataObj.slug === order.collection.slug);
              if (matchingObject) {
                const ownedAssetCount = matchingObject.owned_asset_count;
                const floorPrice = order.collection.stats.floor_price;
                const heldValue = ownedAssetCount * floorPrice;
                const avgPrice = order.collection.stats.thirty_day_average_price;
                const realValue = heldValue * avgPrice
                order.collection.stats = { ...order.collection.stats, owned_asset_count: ownedAssetCount, held_value: heldValue, realValue: realValue };
                //const stat = order.collection.stats
                //const value = stat.held_value

                //console.log(order.collection.stats)

                //const values = data.map(item => item.name)
                //console.log(order.collection.stats);
              }
            });

            let addy = fetchedOrders.map((item, i) => Object.assign({}, item, fetchedOrders[i].collection.primary_asset_contracts))
            let addys = fetchedOrders.map((item, i) => Object.assign({}, item, addy[i][0]))
            //let merged = addys.map(({address})=>[address]).flat(1);
            let xAddress = addys.filter(x => x.address !== undefined)
            //xAddress.pop()

            //let names = fetchedOrders.collection.name
            //let values = fetchedOrders.map((item, i) => Object.assign({}, item, fetchedOrders[i].collection.stats.held_value))

            const names = xAddress.map(item => item.name)
            const heldValues = xAddress.map(item => item.collection.stats.held_value)
            const avgPrice = xAddress.map(item => item.collection.stats.thirty_day_average_price)
            const floor = xAddress.map(item => item.collection.stats.floor_price)
            const volume = xAddress.map(item => {
              const value = item.collection.stats.thirty_day_volume;
              return parseFloat(value.toFixed(2));
            });
            //const realValue = floor * avgPrice

            // Create object of arrays names and values
            const result = names.map((name, i) => {
                return { name: name, floor: floor[i], average: avgPrice[i], volume: volume[i], value: heldValues[i]};
            });

            console.log(xAddress);

            setObject(result)
            setFilterData(xAddress);
            setWallets(xAddress);
          });

      } catch (err) {
        console.log(err);
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
        //console.log(transfersNFT.result[i].value);
        //setTxs(transfersNFT.result[0].token_address)
        for (i=i; i<transfersNFT.result.length; i++) {
          //setTxTime(transfersNFT.result[i].block_timestamp)
          //console.log(transfersNFT);

          fetch(`https://api.reservoir.tools/collections/activity/v5?collection=${transfersNFT.result[0].token_address}`)
          .then(resp => resp.json())
          .then(data => {
            //console.log(data.activities)
            let price = data.activities.price
            //setTxPrice(price)
            //setTxs(data.activities.metadata.imageUrl)
            //setTxName(data.collection.name)
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
      { name: 'Eth Price', stat: prices },
      { name: 'Gas (gwei)', stat: gases },
      { name: 'Total NFT Collections', stat: wallets0 },
  ]

  const stats1 = [
      //{ name: txName, stat: txs, stat1: txPrice / 10**18 },
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

  const getWallet = () => {
    setLoading2(true);
     console.log(object);

     const ctx = document.getElementById("myChart").getContext("2d");

     function colorFromRaw(ctx) {
       if (ctx.type !== "data") {
         return "transparent";
       }

       const value = ctx.raw.v;
       let alpha = (1 + Math.log(value)) / 5;
       let color = "purple";

       return helpers.color(color).alpha(alpha).rgbString();
     }

     const tmpChart = Chartjs.getChart(ctx);
     if (tmpChart) {
       tmpChart.destroy();
     }

     new Chartjs(ctx, {
       type: "treemap",
       data: {
         datasets: [
             {
               tree: object,
               key: "volume",
               groups: ["name"],
               spacing: 0.5,
               borderWidth: 1.5,
               borderColor: "black",
               backgroundColor: (ctx) => colorFromRaw(ctx),
               labels: {
                 display: true,
                 align: "center",
                 position: "center",
                 color: "white",
                 formatter: (ctx) => {
                   return [`${ctx.raw.g}`, `${ctx.raw.v}`];},
                },
             },
         ],
       },
       options: {
         scales: {
           x: {
             ticks: {
               callback: function (value) {
                 const val = `${value}`;
                 return val.length > 4 ? `${val.substring(0, 4)}...` : val;
                 },
             },
           },
         },
         responsive: true,
         plugins: {
           title: {
             display: true,
             text: `30 DAY VOLUME`,
           },
           legend: {
             display: false,
           },
         },
       },
     });
     setLoading2(false);
     setShowChart(true);
  };

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
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div>
                  <div>
                    <dl className="mt-5 grid gap-5 sm:grid-cols-4">
                      {loading2 ? (
                        <Spinner />
                      ) : showChart ? (
                        <canvas id="myChart2" />
                      ) : (
                        <button
                            className="px-7 py-4 text-xl rounded-xl bg-purple-300 animate-pulse"
                            onClick={() => getWallet()}>
                          Show Map
                        </button>
                      )}
                    </dl>
                    <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                      {
                        (loading)
                            ?
                            <Spinner />
                            :
                            <canvas id="myChart" />
                      }
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

                        {

                          (!userA)

                              ?

                              <AppContainer/>

                              :
                                <div className="grid grid-cols-1 gap-10 sm:grid-cols-1">
                                  <div className="my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
                                    <div className="py-2 align-middle h-96 min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
                                      <div className="shadow sm:rounded-sm">
                                        <div className="grid grid-cols-4 gap-1">

                                            {filterData && filterData.map((wallet, index) => {
                                              const w = wallet
                                              const floor = w.collection.stats.floor_price;
                                              const owned = w.collection.stats.owned_asset_count;
                                              const name = w.collection.name;
                                              const v = w.collection.stats.total_volume;
                                              const volume = v.toFixed(2)
                                              const y = w.collection.image_url

                                              //console.log(wallet.collection)

                                              const getApes = () => {
                                                setLoading(true)

                                                const url1 = `${baseURL}?contractAddress=${wallet.address}`

                                                const urls = [
                                                    url1,
                                                    fetchURL2,
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

                                                              //console.log(merged)

                                                              let merged1 = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].collection));
                                                              //let distribution = [].concat([merged1[0].tokenCount - sum], sum).map(Number);
                                                              //console.log(mergedCount[0]);
                                                              //let distribution1 = distribution[0] / 10000
                                                              //console.log(distribution1);

                                                              setAmount(mergedCount[0])
                                                              //console.log(amountOwned);

                                                              let ctx = document.getElementById("myChart").getContext('2d');

                                                              function colorFromRaw(ctx) {
                                                                if (ctx.type !== 'data') {
                                                                  return 'transparent';
                                                                }
                                                                const value = ctx.raw.v;
                                                                //console.log(value)
                                                                let alpha = (1 + Math.log(value)) / 5;
                                                                const color = value > 5 ? 'gold' : 'green';
                                                                return helpers.color(color)
                                                                  .alpha(alpha)
                                                                  .rgbString();
                                                              }

                                                              const tmpChart = Chartjs.getChart('myChart');
                                                              if (tmpChart) {
                                                                tmpChart.destroy()
                                                              }


                                                              new Chartjs(ctx,{
                                                                type: "treemap",
                                                                data: {
                                                                  datasets: [
                                                                    {
                                                                      tree: merged,
                                                                      key: 'tokenCount',
                                                                      groups: ['ownerAddress'],
                                                                      spacing: 0.5,
                                                                      borderWidth: 1.5,
                                                                      borderColor: 'black',
                                                                      backgroundColor: (ctx) => colorFromRaw(ctx),
                                                                      labels: {
                                                                        display: true,
                                                                        align: 'center',
                                                                        position: 'top',
                                                                        color: "white",
                                                                        formatter: (ctx) => {
                                                                          //const result = ctx.raw.g
                                                                          //const result1 = result.match(/.{1,4}/g) ?? [];
                                                                          //console.log(result1)
                                                                          return `${ctx.raw.g}: ${ctx.raw.v}`
                                                                        }
                                                                      },
                                                                    }
                                                                  ]
                                                                },
                                                                options: {
                                                                  scales: {
                                                                    x: {
                                                                      ticks: {
                                                                        callback: function (value) {
                                                                          const val = `${value}`
                                                                          return val.length > 4 ? `${val.substring(0, 4)}...` : val;
                                                                        }
                                                                      }
                                                                    }
                                                                  },
                                                                  responsive: true,
                                                                  plugins: {
                                                                    title: {
                                                                      display: true,
                                                                      text: `${amount} Apes owned by ${wallet.collection.slug} holders`
                                                                    },
                                                                    legend: {
                                                                      display: false
                                                                    },
                                                                  }
                                                                },
                                                              });



                                                              //const key = 'stats.floor_price' + '*' + 'stats.owned_asset_count';


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
                                                    <button onClick={getApes} disabled={loading}>
                                                      <img
                                                          className="inline-block h-40 w-40"
                                                          src={y}
                                                      />
                                                    </button>
                                                    <div><strong>NAME</strong></div>
                                                    {name}
                                                  </div>
                                                  <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                                                    <div><strong>Owned</strong></div>
                                                    {owned}
                                                  </div>
                                                  <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                                                    <div><strong>PRICE FLOOR</strong></div>
                                                    {floor} eth
                                                  </div>
                                                  <div className="whitespace-nowrap text-sm font-medium text-gray-500 place-items-end">
                                                    <div><strong>TOTAL VOLUME</strong></div>
                                                    {volume} eth
                                                  </div>
                                                  <div className="whitespace-nowrap text-sm font-medium text-gray-500 place-items-end">
                                                    <div><strong>24h PRICE CHANGE</strong></div>
                                                    {wallet.collection.stats.one_day_change.toFixed(2)}
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

                                  </div>
                                </div>
                        }
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