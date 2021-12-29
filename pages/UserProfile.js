import "./_app.js";
import { ethers } from 'ethers';
import React, { useState } from "react";
import Link from "next/link";
import contract from "./contracts/contract.json";
import contract2 from "./contracts/contract2.json";
import contract3 from "./contracts/contract3.json";
import dataAzuki from "./contracts/azuki.json";
import dataBAYC from "./contracts/BAYC.json";
import dataPunk from "./contracts/punks.json";
import dataKongz from "./contracts/kongz.json";
import dataDoodles from "./contracts/doodles.json";
import dataCcats from "./contracts/c_cats.json";
import dataPcomics from "./contracts/pcomics.json";
import dataNftworlds from "./contracts/nftworlds.json";
import dataMeemo from "./contracts/nftworlds.json";

//import { table } from 'table';
//import DataTable from "../components/DataTable";
import DataTables from "../components/DataTables";
import dfd from "danfojs";
import Papa from "papaparse";
//import * as dfd from "danfojs-node";

const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0")

const contractAddress = "0xbd9071b63f25dd199079ed80b3b384d78042956b";
const contractAddress2 = "0xb2b42942133130e09d54d9712c3f7e1b54d088cb";
const contractAddress3 = "0xfb7d186e24e128be1f1339fb9c2ba6fdbd87c6f9";
const azukiAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544";
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
const nftworldsAddress = "0xbd4455da5929d5639ee098abfaa3241e9ae111af";
const kongzAddress = "0x57a204aa1042f6e66dd7730813f4024114d74f37";
const doodlesAddress = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
const c_catsAddress = "0x1a92f7381b9f03921564a437210bb9396471050c";
const punksAddress = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";
const meemoAddress = "0xa4bc3207aa638a30a3cc6a23e71e311bfc7bf689";

const abi = contract;
const abi2 = contract2;
const abi3 = contract3;
const abi4 = dataAzuki;
const abi5 = dataBAYC;
const abi6 = dataNftworlds;
const abi7 = dataKongz;
const abi8 = dataDoodles;
const abi9 = dataCcats;
const abi10 = dataPunk;
const abi11 = dataMeemo;

const addressesAzuki = [];
const addressesBAYC = [];
const addressesNftworlds = [];
const addressesKongz = [];
const addressesDoodles = [];
const addressesCcats = [];
const addressesPunks = [];
const addressesMeemo = [];

//const ensAzuki = [];

let i=1;

function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [compIndex, setCompIndex] = useState();

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

  const verifyHandler = async () => {
    const { ethereum } = window;

    if (ethereum) {
      try {

        const nftContract = new web3.eth.Contract(abi, contractAddress);
        const nftContract2 = new web3.eth.Contract(abi2, contractAddress2);
        const nftContract3 = new web3.eth.Contract(abi3, contractAddress3);
        console.log(nftContract3)

        let nftFunction = await nftContract.methods.balanceOf(currentAccount).call();
        let nftFunction2 = await nftContract2.methods.balanceOf(currentAccount).call();
        let nftFunction3 = await nftContract3.methods.balanceOf(currentAccount).call();

        if (nftFunction > 0 || nftFunction2 > 0 || nftFunction3 > 0) {
          console.log("You have", nftFunction, "Grillz");
          console.log("Access Granted: ", currentAccount);
          console.log(isLoadingSecond);
          setIsLoadingSecond(currentAccount);
        } else {
          console.log("Not Verified");
          console.log(!isLoadingSecond);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  const qtoolsHandler = async () => {
      const { ethereum } = window;
      const dfd = require("danfojs")
      const azukiContract = new web3.eth.Contract(abi4, azukiAddress);
      const baycContract = new web3.eth.Contract(abi5, addressBAYC);
      const nftworldsContract = new web3.eth.Contract(abi6, nftworldsAddress);
      const doodlesContract = new web3.eth.Contract(abi8, doodlesAddress);
      const c_catsContract = new web3.eth.Contract(abi9, c_catsAddress);
      const punksContract = new web3.eth.Contract(abi10, punksAddress);
      const meemoContract = new web3.eth.Contract(abi11, meemoAddress);

      for (let i = 0; i < 10001; i++) { // shows 1, then 2...
        try {
          //let ownerAzuki = await azukiContract.methods.ownerOf(i).call();
          let ownerBAYC = await baycContract.methods.ownerOf(i).call();
          //let ownerNftworlds = await nftworldsContract.methods.ownerOf(i).call();
          //let ownerDoodles = await doodlesContract.methods.ownerOf(i).call();
          //let ownerCcats = await c_catsContract.methods.ownerOf(i).call();
          //let ownerPunks = await punksContract.methods.punkIndexToAddress(i).call();
          let ownerMeemo = await meemoContract.methods.ownerOf(i).call()

          //let provider = new ethers.providers.Web3Provider(ethereum);
          //let name = await provider.lookupAddress(ownerAzuki);

          //ensAzuki.push(name);
          //addressesAzuki.push(ownerAzuki);
          addressesBAYC.push(ownerBAYC);
          //addressesNftworlds.push(ownerNftworlds);
          //addressesDoodles.push(ownerDoodles);
          //addressesCcats.push(ownerCcats);
          //addressesPunks.push(ownerPunks)
          addressesMeemo.push(ownerMeemo)

          //addressesAzuki.print()
          //console.table(addressesAzuki);

        } catch (err) {

        }
      }

        //let ensData = {"Addresses": [ensAzuki]}
        //let azukiData = {"Addresses": [addressesAzuki]}
        let baycData = {"Addresses": [addressesBAYC]}
        //let nftworldsData = {"Addresses": [addressesNftworlds]}
        //let doodlesData = {"Addresses": [addressesDoodles]}
        //let c_catsData = {"Addresses": [addressesCcats]}
        //let punksData = {"Addresses": [addressesPunks]}
        let meemoData = {"Addresses": [addressesMeemo]}

        //console.log(azukiData["Addresses"])
        //console.log(baycData["Addresses"])

        let index = ["Addresses"];
        //let a = new dfd.DataFrame(azukiData["Addresses"], { index }).T
        let b = new dfd.DataFrame(baycData["Addresses"], { index }).T
        //let c = new dfd.DataFrame(nftworldsData["Addresses"], { index }).T
        //let e = new dfd.DataFrame(doodlesData["Addresses"], { index }).T
        //let f = new dfd.DataFrame(c_catsData["Addresses"], { index }).T
        //let g = new dfd.DataFrame(punksData["Addresses"], {index}).T
        let h = new dfd.DataFrame(meemoData["Addresses"], { index }).T

        //console.log(a)
        //console.log(b)

        //let aa = new dfd.DataFrame(ensData["Addresses"], { index }).T
        //let bb = new dfd.DataFrame(ensData["Addresses"], { index }).T
        //let ee = new dfd.DataFrame(ensData["Addresses"], { index }).T
        //let ff = new dfd.DataFrame(ensData["Addresses"], { index }).T

        //aa.rename({"Addresses": "ENS"}, { inplace: true })
        //aa.print()

        //let aSeries = a.column("Addresses")
        let bSeries = b.column("Addresses")
        //let cSeries = c.column("Addresses")
        //let eSeries = e.column("Addresses")
        //let fSeries = f.column("Addresses")
        //let gSeries = g.column("Addresses")
        let hSeries = h.column("Addresses")

        //aSeries.unique().print()
        //aSeries.print()
        //bSeries.print()

        //let aValue = a.column("Addresses").valueCounts()
        let bValue = b.column("Addresses").valueCounts()
        //let cValue = c.column("Addresses").valueCounts()
        //let eValue = e.column("Addresses").valueCounts()
        //let fValue = f.column("Addresses").valueCounts()
        //let gValue = g.column("Addresses").valueCounts()
        let hValue = h.column("Addresses").valueCounts()

        //aValue.print()
        //bValue.print()
        //console.log(aValue)

        //let aVal = dfd.concat({ dfList: [aSeries.unique(), aValue], axis: 1 })
        let bVal = dfd.concat({ dfList: [bSeries.unique(),  bValue], axis: 1 })
        //let cVal = dfd.concat({ dfList: [cSeries.unique(), cValue], axis: 1 })
        //let eVal = dfd.concat({ dfList: [eSeries.unique(), eValue], axis: 1 })
        //let fVal = dfd.concat({ dfList: [fSeries.unique(), fValue], axis: 1 })
        //let gVal = dfd.concat({ dfList: [gSeries.unique(), gValue], axis: 1 })
        let hVal = dfd.concat({ dfList: [hSeries.unique(), hValue], axis: 1 })

        //let cVal = dfd.concat({ dfList: [aVal, bVal], axis: 0 })

        //let aa = aVal.rename({ "0": "Addresses", "01": "Azuki Count" }, { inplace: true })
        //let bb = bVal.rename({ "0": "Addresses", "01": "BAYC Count" }, { inplace: true })
        //aa.print()
        //bb.print()

        //aVal.print()
        //bVal.print()
        //console.log(aVal)
        //console.log(bVal)
        //console.log(cVal)

        let df = dfd.merge({ left: hVal, right: bVal, on: ["0"], how: "inner"})
        df.rename({ "0": "Addresses", "01": "Meemo", "01_1": "BAYC" }, { inplace: true })
        df.sortValues("Meemo", { ascending: false, inplace: true })
        df.print()
        df.toCSV({ fileName: "baycMeemo.csv", download: true});

        //let dfx = df.iloc({rows: ["0:4"]})

        //df.toCSV({ fileName: "testOut.csv", download: true});

        //const jsonObj = dfd.toJSON(df); //column format
        //console.log(jsonObj)
        //const csv = Papa.unparse(jsonObj)
        //console.log(dfx)

        //Papa.parse("./csv/boredAzuki.csv", {
          //download: true,
          //header: true,
          //complete: data => {
            //console.log(data.data);
            //setRows(data);
          //}
        //});
  };

  const tableHandler = async () => {

  };

  const rankingsHandler = () => {};

  const mysteryHandler = () => {};

  const qtoolsButton = () => {
    return (
        <button
            onClick={qtoolsHandler}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Q-Tools
        </button>
    );
  };

  const tableButton = () => {
    return (
      <Link href="/Portfolio">
        <button
            onClick={portfolioHandler}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Portfolio
        </button>
      </Link>
    );
  };

  const rankingsButton = () => {
    return (
      <button
          onClick={rankingsHandler}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Rankings
      </button>
    );
  };

  const mysteryButton = () => {
    return (
      <button
          onClick={mysteryHandler}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            ?
      </button>
    );
  };

  const btn = () => {
    if (isLoading === false && isLoadingSecond === true) {
      return (
        <div className="main-app">
          <button
              onClick={connectWalletHandler}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Welcome
          </button>
        </div>
      );
    } else if (isLoading === true && isLoadingSecond === true) {
      return (
        <div className="main-app">
          <button
              onClick={verifyHandler}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Enter
          </button>
        </div>
      );
    } else {
      return (
        <div className="grid grid-rows-4 hover:grid-rows-4 gap-4">
          {qtoolsButton()}
        </div>
      );
    }
  };

  return (
      <div className="">
        {btn()}
      </div>
  );
}

export default Auth;
