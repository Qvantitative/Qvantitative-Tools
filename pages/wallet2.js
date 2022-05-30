import React, {useState, useEffect, Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {HomeIcon, MenuIcon, UsersIcon, XIcon} from "@heroicons/react/outline";
import ENS from '@ensdomains/ensjs'
import Link from "next/link";
import {image} from "tailwindcss/lib/util/dataTypes";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMoralis } from "react-moralis";
import {useMoralisWeb3Api} from "react-moralis";

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
  const [filterData, setFilterData ] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
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


  const connectWalletHandler = async () => {
    const { ethereum } = window;

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

        const baseURL1 = "https://api.looksrare.org/api/v1/collections/";
        const options = {
          address: accounts[0],
          chain: "eth",
        };
        const data1 = await Web3Api.account.getNFTs(options);
        //console.log(data1.result);

        const responses = data1.result.map((result, i) =>
                fetch(`${baseURL1}stats?address=${data1.result[i].token_address}`)
                    .then((res) => res.json()),
          );
            Promise.all(responses)
                .then((fetchedOrders) => {
                  //const aData = data.ownedNfts.concat(fetchedOrders)
                  //console.log(data.ownedNfts);
                  //console.log(fetchedOrders);
                  let merged = data1.result.map((item, i) => Object.assign({}, item, fetchedOrders[i]));
                  console.log(merged)
                  merged.sort(function (x, y) {
                    return y.data?.floorPrice - x.data?.floorPrice;
                  })

                  setFilterData(merged);
                  setWallets(merged);
                });

        //let name = ens.getName(accounts[0])
        //if(accounts[0] != ens.name(name).getAddress()) {
        //  name = null;
        //  console.log(name)
        //}

        let balance = await web3.eth.getBalance(accounts[0])/10**18;
        //console.log(balance.toFixed(2))
        setBalances(balance.toFixed(2))

        let gas = await web3.eth.getGasPrice()/10**9;
        //console.log(gas.toFixed(0))
        setGases(gas.toFixed(0))

        let data = await CoinGeckoClient.coins.fetch('ethereum', {});
        //console.log(data.data.market_data.current_price.usd)
        setPrices(data.data.market_data.current_price.usd)

      } catch (err) {
        console.log(err);
      }

    } else {
      console.log("Ethereum object does not exist");
    }

  };

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
  ]

  //console.log(wallets)

  return (
    <>
      {/*
        Use to add Button:

        ```
        <div>
          <button className="fetch-button" onClick={getStudents}>
            Get Projects
          </button>
          <br />
        </div>
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              {useEffect(() => {

                return(
                <div
                    className="flex-shrink-0 w-full group block" onLoad={connectWalletHandler()}
                />
                );
              }, []
              )}
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <div>
                  <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                                    const floor = wallet.data?.floorPrice/10**18;
                                    //console.log(floor)
                                    const volume7d = wallet.data?.volume7d/10**18;
                                    const metadata = JSON.parse(wallet.metadata)
                                    //console.log(metadata)

                                    const w = metadata?.image
                                    //console.log(w)

                                    //REPLACE IPFS URL
                                    if(!w) return
                                    const x = w.replace("ipfs://", "https://ipfs.io/ipfs/")
                                    const y = x.replace("https://ipfs.io/ipfs/ipfs/", "https://ipfs.io/ipfs/")
                                    //console.log(y)

                                  return(
                                  <div className="wallet" key={index}>
                                    <div className={filterData % 2 === 0 ? 'bg-white' : 'bg-gray-50 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6' }>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                                        <img
                                            className="inline-block h-20 w-20 rounded-full"
                                            src={y}
                                        />
                                        <div><strong>NAME</strong></div>
                                        {metadata?.name}
                                      </div>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div><strong>PRICE FLOOR</strong></div>
                                        {floor}
                                      </div>
                                      <div className="whitespace-nowrap text-sm font-medium text-gray-900 place-items-end">
                                        <div><strong>7d Vol</strong></div>
                                        {volume7d}
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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}

                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
