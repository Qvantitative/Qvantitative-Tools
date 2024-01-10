import React, {useEffect, useState, Component, useCallback, useRef, useContext} from 'react'
import {Disclosure} from "@headlessui/react";
import {MenuIcon, XIcon} from "@heroicons/react/outline";
import {useMoralisWeb3Api} from "react-moralis";
//import { createAlchemyWeb3 } from "@alch/alchemy-web3";
//import PieChart from "./components/PieChart";
//import { useNavigate } from "react-router-dom";
import Chartjs from "chart.js/auto";
import {MultipleContext} from "./Contexts/MultipleContext";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import {app} from "../services/server";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

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

let i=0

const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0")

const baseURL = "https://eth-mainnet.alchemyapi.io/nft/v2/rpgRyd5BBElsZ8OaDerQFRH3ZfXIb_nw/getOwnersForCollection/";
const baseURL1 = "https://api.reservoir.tools/users/"
const fetchURL1 = `${baseURL}?contractAddress=0x740c178e10662bbb050bde257bfa318defe3cabc`;
const fetchURL2 = `${baseURL}?contractAddress=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`;
const req = new Request(fetchURL1)

const urls = [
    fetchURL1,
    fetchURL2,
];

export default function App() {
  const [addresses, setAddresses] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccount1, setCurrentAccount1] = useState(null);
  const [apes, setApes] = useState(null);
  const [apeCount, setApeCount] = useState(null)
  const [ens, setEns] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chartContainer = useRef(null);
  const chartContainer1 = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartInstance1, setChartInstance1] = useState(null);
  const Web3Api = useMoralisWeb3Api();
  const {user, setUser} = useContext(MultipleContext)
  const db = getFirestore(app)


  //let navigate = useNavigate();
  //navigate("./components/PieChart", { state: ownerAddress });

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

// Event Listener - Change URL
//document.getElementById('btn').addEventListener('click', function() {
 //let url = 'https://newsapi.org/v2/top-headlines?sources=cnn&apiKey=Apikey123';
 //const req = new Request(url);
 //sendRequest(req);
//})

  const dbRef = collection(db, "apeHolders");

  useEffect(() => {
    async function fetchWallets() {
      const {ethereum} = window;

      if (ethereum) {

        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          setCurrentAccount(accounts[0]);
          setIsLoading((currentAccount) => !currentAccount);

          // get ENS domain of an address
          const options = { address: accounts[0] };
          const resolve = await Web3Api.resolve.resolveAddress(options);
          console.log(resolve.name);
          setCurrentAccount1(resolve.name);

        } catch (err) {
          console.log(err);
        }
      }
    }

    fetchWallets()
  }, [chartContainer])


  useEffect(() => {
    async function fetchOwners() {
          Promise.all(
            urls.map(url =>
              fetch(url)
                .then(res => res.json())
                .then(res => res.ownerAddresses)
            ))
              .then(data => {
                let arrIntersection = data[0].filter((a) => {
                return data[1].includes(a)
                }).map(item => ({ ownerAddress: item }))

                //console.log(arrIntersection)

                //for (i=i; i < arrIntersection.length; i++) {
                //}

                const responses = arrIntersection.map((data) =>
                    fetch(`${baseURL1}${data.ownerAddress}/collections/v2?collection=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&includeTopBid=false&offset=0`)
                        .then((res) => res.json()),
                    );
                    Promise.all(responses)
                        .then(fetchedOrders => {
                          //setContracts(fetchedOrders.map(fetchedOrders => fetchedOrders.address))
                            //console.log(fetchedOrders[i].collections[0].ownership)
                          let merged = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].ownership));
                            merged.sort(function (x, y) {
                              return y.tokenCount - x.tokenCount;
                            })

                          console.log(merged)

                          setFilterData(merged);
                          setAddresses(merged);

                          let sum = merged.reduce(function(prev, current) {
                            return prev + +current.tokenCount
                          }, 0);
                          //console.log(sum)

                          let mergedOwner = merged.map(({ownerAddress})=>[ownerAddress]).flat(1);
                          setEns(mergedOwner)
                          let mergedToken = merged.map(({tokenCount})=>[tokenCount]).flat(1);
                          let mergedCount = mergedToken.map(Number)
                          //mergedCount.unshift(sum)

                          let merged1 = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].collection));
                          let distribution = [].concat([merged1[0].tokenCount - sum], sum).map(Number);
                          //console.log(mergedOwner);

                          const data = {
                             owner: mergedOwner,
                             apeCount: mergedCount
                          };

                          addDoc(dbRef, data)
                            .then(async docRef => {
                                const docSnap = await getDoc(docRef)
                                //console.log(docSnap.data().owner)
                                setApes(docSnap.data().owner)
                                setApeCount(docSnap.data().apeCount)
                                console.log("Document has been added successfully");
                            })
                            .catch(error => {
                                console.log(error);
                            })

                          const chartConfig = {
                            type: "pie",
                            data: {
                                labels: ["Max Supply", "BAYC Holders from NFT Worlds"],
                                datasets: [
                                    {
                                        data: distribution,
                                        backgroundColor: chartColors,
                                        hoverBackgroundColor: chartColors
                                    }
                                ]
                            },
                          };

                          const chartConfig1 = {
                            type: "pie",
                            data: {
                                labels: apes,
                                datasets: [
                                    {
                                        data: apeCount,
                                        backgroundColor: chartColors,
                                        hoverBackgroundColor: chartColors
                                    }
                                ]
                            },
                          };

                          if (chartContainer && chartContainer.current) {
                              const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
                              //newChartInstance.destroy()
                              setChartInstance(newChartInstance);
                          }

                          if (chartContainer1 && chartContainer1.current) {
                              const newChartInstance = new Chartjs(chartContainer1.current, chartConfig1);
                              //newChartInstance.destroy()
                              setChartInstance1(newChartInstance);
                          }

                        });
              });
    }

    fetchOwners()
  }, [chartContainer])

  //useEffect(() => {
  //const fetchAddress = async () => {
    // get ENS domain of an address
  //  const options = { address: accounts[0] };
  //  const resolve = await Web3Api.resolve.resolveAddress(options);
  //  console.log(resolve);
  //};
  //    fetchAddress()
  //}, [])


  const searchByName = (props) => {
    props.persist();
    // Get the search term
    const searchItem = props.target.value.trim();
    // If search term is empty fill with full user addresses data
    if(!searchItem.trim()) {
      setFilterData(addresses);
    }

    // Search the name and if it is found then return the same array
    const searchIn = (title) => {
      if(title?.indexOf(searchItem) !== -1) {
        return true;
      }
      return false;
    };

    if (Array.isArray(addresses)) {
      const result2 = addresses.filter(item => item);
      console.log('arr is an array');
    } else {
      console.log('arr is not an array');
    }

    // Filter the array
    const filteredData = addresses.filter((item) => {
      return searchIn(item.ownerAddress);
    });

    // Set the state with filtered data
    setFilterData(filteredData);
  }

  const updateDataset = (datasetIndex, newData) => {
      chartInstance.data.datasets[datasetIndex].data = newData;
      chartInstance.update();
  };

  //console.log(filterData)

  //useEffect(() => {
  //  if (chartContainer && chartContainer.current) {
  //    const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      //newChartInstance.destroy()
  //    setChartInstance(newChartInstance);
  //  }
  //}, [chartContainer]);

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
                <div className="py-4">
                  <div className="">
                      <div className="grid grid-cols-2 gap-10 flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle h-96 min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
                            <div className="shadow border-b border-gray-200 sm:rounded-lg border-2">

                              <div className="search" id="search">
                                  <input type="text" name="searchByName" onChange={(e) => searchByName(e)} ></input>
                              </div>

                              <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                      <tr>
                                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                              WALLET
                                          </th>
                                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                              BAYC Holders from NFT Worlds
                                          </th>
                                      </tr>
                                  </thead>

                                  {filterData && filterData.map((wallet, index) => {
                                    //const wallets = wallet.ownerAddress;
                                    //console.log(wallet)
                                    //const v = wallet.tokenCount;
                                    //console.log(v)
                                    //const volume = v.toFixed(2)

                                    //const y = wallet.collection.image_url
                                    //console.log(w)

                                    // get ENS domain of an address
                                    //const options = {address: wallet.ownerAddress};
                                    //console.log(wallet)

                                    const onButtonClick = () => {
                                      const data = [[10000-wallet.tokenCount], wallet.tokenCount];
                                      updateDataset(0, data);
                                    };

                                  return(
                                  <tbody className="wallet" key={index}>
                                    <tr className={filterData % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          <button onClick={onButtonClick}>{
                                              wallet.ownerAddress
                                          }
                                          </button></td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{wallet.tokenCount}</td>
                                    </tr>
                                  </tbody>

                                  )}
                                  )}
                              </table>
                            </div>
                          </div>
                        </div>
                          <div>
                              <canvas ref={chartContainer} />
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