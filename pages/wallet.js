/* This example requires Tailwind CSS v2.0+ */
import React, {Fragment, useEffect, useState} from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {BellIcon, HomeIcon, MenuIcon, XIcon} from '@heroicons/react/outline'
import {useMoralisWeb3Api} from "react-moralis";
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
const contractAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

const i = 0;

const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0")

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon, current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [wallets, setWallets] = useState(null);
  const [wallets0, setWallets0] = useState(null);
  const [balances, setBalances] = useState(null);
  const [gases, setGases] = useState(null);
  const [prices, setPrices] = useState(null);
  const [walls, setWalls] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedValue, setSelectedValue] = useState('tous');
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

  async function connectWalletHandler() {
    const {ethereum} = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    if (ethereum) {

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts)
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsLoading((currentAccount) => !currentAccount);

        const baseURL2 = "https://api.opensea.io/api/v1/collections"
        const baseURL3 = "https://api.opensea.io/api/v1/collection"

        const fetchURL = `${baseURL2}?asset_owner=${accounts[0]}&offset=0&limit=300`;
        fetch(fetchURL, {
          method: 'GET',
          redirect: 'follow',
        })
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
                //setContracts(fetchedOrders.map(fetchedOrders => fetchedOrders.address))
                let merged = data.map((item, i) => Object.assign({}, item, fetchedOrders[i]));
                  merged.sort(function (x, y) {
                    return y.collection.stats.floor_price - x.collection.stats.floor_price;
                  })
                //console.log(fetchedOrders);
                setFilterData(merged);
                setWallets(merged);
              });
          });

        //let name = ens.getName(accounts[0])
        //if(accounts[0] != ens.name(name).getAddress()) {
        //  name = null;
        //  console.log(name)
        //}

      } catch (err) {
        console.log(err);
      }

    } else {
      console.log("Ethereum object does not exist");
    }
  }

  async function fetchStats() {
    const {ethereum} = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

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
      { name: 'Total Collections', stat: wallets0 },
      { name: 'Eth Price', stat: prices },
      { name: 'Gas (gwei)', stat: gases },
  ]

  useEffect(() => {
    connectWalletHandler()
    const interval=setInterval(()=>{
      connectWalletHandler()
     },5000)
     return()=>clearInterval(interval)
  }, [currentAccount])

  useEffect(() => {
    fetchStats()
    const interval=setInterval(()=>{
      fetchStats()
     },5000)
     return()=>clearInterval(interval)
  }, [gases, prices])

  //console.log(wallets)

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
                              <h1 className="text-md font-bold text-white-900">{currentAccount}</h1>
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
                          {currentAccount}
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
                  <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                    {stats.map((item) => (
                      <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="py-4">
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
                        <div className="my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
                          <div className="py-2 align-middle h-96 min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
                            <div className="shadow sm:rounded-lg">
                              <div className="grid grid-cols-4 gap-4">

                                  {filterData && filterData.map((wallet, index) => {
                                    const floor = wallet.collection.stats.floor_price;
                                    //console.log(floor)
                                    const v = wallet.collection.stats.total_volume;
                                    const volume = v.toFixed(2)


                                    const y = wallet.collection.image_url
                                    //console.log(w)

                                  return(
                                  <div className="wallet" key={index}>
                                    <div className={filterData % 2 === 0 ? 'bg-white' : 'bg-gray-50 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6' }>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                                        <img
                                            className="inline-block h-20 w-20"
                                            src={y}
                                        />
                                        <div><strong>NAME</strong></div>
                                        {wallet.collection.name}
                                      </div>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div><strong>PRICE FLOOR</strong></div>
                                        {floor}
                                      </div>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900 place-items-end">
                                        <div><strong>TOTAL VOLUME</strong></div>
                                        {volume}
                                      </div>
                                    </div>
                                  </div>

                                  )}
                                  )}
                              </div>
                            </div>
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