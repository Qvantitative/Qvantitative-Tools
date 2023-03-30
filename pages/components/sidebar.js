import { Fragment, useState, useEffect, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {useRouter} from "next/router";
import {MultipleContext} from "../Contexts/MultipleContext";
import Link from "next/link";
import React from "react";
import {app} from "../../services/server";
import {getAuth} from "firebase/auth";
import {useMoralisWeb3Api} from "react-moralis";
import AppContainer from "../App";

const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0");

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const baseURL2 = "https://api.opensea.io/api/v1/collections";
const baseURL3 = "https://api.opensea.io/api/v1/collection";

export const navigation = [
  { name: 'Bored Ape Yacht Club', href: '../wallet', icon: UsersIcon, current: false },
  { name: 'MoonBirds', href: '../walletMB', icon: FolderIcon, current: false },
  { name: 'Azuki', href: '#', icon: CalendarIcon, current: false },
  { name: 'Checks', href: '#', icon: InboxIcon, current: false },
]

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccount1, setCurrentAccount1] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const Web3Api = useMoralisWeb3Api();
  const [wallets0, setWallets0] = useState(null);
  const [balances, setBalances] = useState(null);
  const [gases, setGases] = useState(null);
  const [prices, setPrices] = useState(null);
  const router = useRouter()
  const { user, setUser }  = useContext(MultipleContext)
  const { userA, setUserA }  = useContext(MultipleContext)
  const auth = getAuth(app);

  async function fetchWallet() {

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        console.log("Found an account! Address:", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsLoading((currentAccount) => !currentAccount);

        fetch(`${baseURL2}?asset_owner=${accounts[0]}&offset=0&limit=300`)
            .then(resp => resp.json())
            .then(data => {
              //console.log(data)
              setWallets0(data.length);
            });

        // get ENS domain of an address
        const options = { address: accounts[0] };
        const resolve = await Web3Api.resolve.resolveAddress(options);
        console.log(resolve.name);
        setCurrentAccount1(resolve.name)

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

  const stats = [
      { name: 'Eth Price', stat: prices },
      { name: 'Gas (gwei)', stat: gases },
      { name: 'Wallet Balance (eth)', stat: balances },
      { name: 'Total NFT Collections', stat: wallets0 },
  ]

  const stats1 = [
      { name: 'Eth Price', stat: prices },
      { name: 'Gas (gwei)', stat: gases },
  ]

  async function logout() {
    await auth.signOut();
    setUser(null);
    setUserA(null);
  }

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

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
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
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      {
                        (!user)
                            ?
                            ""
                            :
                            <div>
                            {currentAccount1 || currentAccount}
                            </div>
                      }
                    </div>
                    {
                      (!user)
                          ?
                          <div className="mt-5 flex-1 space-y-1 px-2">
                            {stats1.map((item) => (
                                <div key={item.name} className="px-4 py-5 bg-gray-700 shadow rounded-lg overflow-hidden sm:p-6">
                                  <dt className="text-sm font-medium text-white truncate">{item.name}</dt>
                                  <dd className="mt-1 text-3xl font-semibold text-white">{item.stat}</dd>
                                </div>
                            ))}
                          </div>
                          :
                          <div className="mt-5 flex-1 space-y-1 px-2">
                            {stats.map((item) => (
                                <div key={item.name} className="px-4 py-5 bg-gray-700 shadow rounded-lg overflow-hidden sm:p-6">
                                  <dt className="text-sm font-medium text-white truncate">{item.name}</dt>
                                  <dd className="mt-1 text-3xl font-semibold text-white">{item.stat}</dd>
                                </div>
                            ))}
                          </div>
                    }
                  </div>
                  <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    {
                      (!user || !userA)
                          ?
                          "Welcome"
                          :
                          <Link href='/'>
                            <a onClick={logout}
                            >
                              Log Out
                            </a>
                          </Link>
                    }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                {
                  (!user)
                      ?
                      ""
                      :
                      <div>
                      {currentAccount1 || currentAccount}
                      </div>
                }
              </div>
              {
                (!user)
                    ?
                    <div className="mt-5 flex-1 space-y-1 px-2">
                      {stats1.map((item) => (
                          <div key={item.name} className="px-4 py-5 bg-gray-700 shadow rounded-lg overflow-hidden sm:p-6">
                            <dt className="text-sm font-medium text-white truncate">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold text-white">{item.stat}</dd>
                          </div>
                      ))}
                    </div>
                    :
                    <div className="mt-5 flex-1 space-y-1 px-2">
                      {stats.map((item) => (
                          <div key={item.name} className="px-4 py-5 bg-gray-700 shadow rounded-lg overflow-hidden sm:p-6">
                            <dt className="text-sm font-medium text-white truncate">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold text-white">{item.stat}</dd>
                          </div>
                      ))}
                    </div>
              }
            </div>
            <div className="flex flex-shrink-0 bg-gray-700 p-4">
                  <div className="flex items-center">
                    {
                      (!user)
                          ?
                          "Welcome"
                          :
                          <Link href='/'>
                            <a onClick={logout}
                            >
                              Log Out
                            </a>
                          </Link>
                    }
                  </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {
                  (!user)
                      ?
                      <h1 className="text-2xl font-semibold text-white-900"></h1>
                      :
                      <h1 className="text-2xl font-semibold text-white-900">Wallet</h1>
                }
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <AppContainer/>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}