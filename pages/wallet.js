import React, {useState, useEffect, Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {HomeIcon, MenuIcon, UsersIcon, XIcon} from "@heroicons/react/outline";

const navigation = [
  { name: 'Top 25 Rewards', href: '#', icon: HomeIcon, current: true },
  { name: 'Azuki Distribution', href: '/Layout', icon: UsersIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [projects, setProjects] = useState(null);
  const [filterData, setFilterData ] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(null);

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

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      //console.log(accounts)
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      setIsLoading((currentAccount) => !currentAccount);

    } catch (err) {
      console.log(err);
    }
  };

  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
    };

  //Get URL and extract content
  const baseURL = "https://eth-mainnet.alchemyapi.io/v2/demo/getNFTs/";
  const ownerAddr = "0x3572DB2E377a4efECa5CBd58A241979C7Cdb00aE";
  const fetchURL = `${baseURL}?owner=${ownerAddr}`;

  useEffect(() => {
    fetch(fetchURL, requestOptions)
      .then(response => response.json())
      .then(response => JSON.stringify(response, null, 2))
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
  },[]);

  const searchByName = (event) => {
    event.persist();
    // Get the search term
    const searchItem = event.target.value.trim();
    // If search term is empty fill with full students data
    if(!searchItem.trim()) {
      setFilterData(projects);
    }

    // Search the name and if it found return the same array
    const searchIn = (name) => {
      if(name.indexOf(searchItem) !== -1) {
        return true;
      }
      return false;
    };

    if (Array.isArray(projects)) {
      const result2 = projects.filter(item => item);
      console.log('arr is an array');
    } else {
      console.log('arr is not an array');
    }

    // Filter the array
    const filteredData = projects.filter((item) => {
      return searchIn(item.collection.name);
    });

    // Set the state with filtered data
    setFilterData(filteredData);
  }

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
                <div className="flex-shrink-0 flex bg-gray-700 p-4">
                  <button className="flex-shrink-0 w-full group block" onClick={connectWalletHandler}>
                    <div className="flex items-center">
                      <div>
                        <UsersIcon
                          className="inline-block h-9 w-9 rounded-full"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">MetaMask</p>
                        <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">View wallet</p>
                      </div>
                    </div>
                  </button>
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
              <button className="flex-shrink-0 w-full group block" onClick={connectWalletHandler}>
                <div className="flex items-center">
                  <div>
                    <UsersIcon
                        className="inline-block h-9 w-9 rounded-full"
                        aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">MetaMask</p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View wallet</p>
                  </div>
                </div>
              </button>
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
                <h1 className="text-2xl font-semibold">User Wallet</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <div className="py-4">
                  <div className="">
                      <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle h-96 min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
                            <div className="shadow border-b border-gray-200 sm:rounded-lg border-2">

                              <div className="search" id="search">
                                  <input type="text" name="searchByName" onChange={(e) => searchByName(e)} ></input>
                              </div>

                              <table className="min-w-full divide-y divide-gray-200">
                                  <tbody>
                                    <tr>
                                      <th><strong>NFT COLLECTION</strong></th>
                                      <th><strong>TOKENID</strong></th>
                                      <th><strong>METADATA</strong></th>
                                    </tr>
                                  </tbody>

                                  {filterData && filterData.map((project, index) => {
                                   const floor = project.floorGlobal/10**18;
                                   const volume24hr = project.volume24hGlobal/10**18;

                                  return(
                                  <tbody className="project" key={index}>
                                    <tr className={filterData % 4 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="whitespace-nowrap text-sm font-medium text-gray-900">{project.collection.name}</td>
                                      <td className="whitespace-nowrap text-sm font-medium text-gray-900"> {tokenid}</td>
                                      <td className="whitespace-nowrap text-sm font-medium text-gray-900"> {metadata}</td>
                                    </tr>
                                  </tbody>

                                  )}
                                  )}
                              </table>
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