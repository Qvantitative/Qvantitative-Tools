import {React, useState} from "react";
import './_app.js';
import { ethers } from "ethers";
//import Link from 'next/link';
import { Stack } from '@chakra-ui/react';
import { Img } from '@chakra-ui/react';
import contract from './contracts/contract.json';
import contract2 from './contracts/contract2.json';
import contract3 from './contracts/contract3.json';

const contractAddress = "0xbd9071b63f25dd199079ed80b3b384d78042956b";
const contractAddress2 = "0xb2b42942133130e09d54d9712c3f7e1b54d088cb";
const contractAddress3 = "0xfb7d186e24e128be1f1339fb9c2ba6fdbd87c6f9";

const abi = contract;
const abi2 = contract2;
const abi3 = contract3;

function Auth() {
  const [isLoading, setIsLoading] = useState(false)
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
      alert("Please install Metamask!")
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      //console.log(accounts)
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      setIsLoading(currentAccount => !currentAccount)
    } catch (err) {
      console.log(err)
    }
  }
  
  const verifyHandler = async () => {
    const { ethereum } = window;
    
    if (ethereum) {
      try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const nftContract = new ethers.Contract(contractAddress, abi, signer);
      const nftContract2 = new ethers.Contract(contractAddress2, abi2, signer);
      const nftContract3 = new ethers.Contract(contractAddress3, abi3, signer);

      const nftFunction = await nftContract.balanceOf(currentAccount);
      const nftFunction2 = await nftContract2.balanceOf(currentAccount);
      const nftFunction3 = await nftContract3.balanceOf(currentAccount);

      if ( nftFunction > 0 || nftFunction2 > 0 || nftFunction3 > 0) {
        console.log("Access Granted: ", currentAccount);
        console.log(isLoadingSecond);
        setIsLoadingSecond(currentAccount)
      } else {
        console.log('Not Verified')
        console.log(!isLoadingSecond)
      }

      } catch (err) {
        console.log(err);
      }
       
    } else {
      console.log("Ethereum object does not exist");
    }
  }

  const merchHandler = () => {}
  const utilityHandler = () => {}
  const virtualHandler = () => {}
  const mysteryHandler = () => {}

  const merchButton = () => {
    return (
      <button 
        onClick={merchHandler} 
        className='cta-button-two merch-button'>
          Portfolio
      </button>
    )
  }

  const utilityButton = () => {
    return (
      <button 
        onClick={utilityHandler} 
        className='cta-button-two one-button'>
          NFT Rarity
      </button>
    )
  }

  const virtualButton = () => {
    return (
      <button 
        onClick={virtualHandler} 
        className='cta-button-two two-button'>
          Q-Tools
      </button>
    )
  }

  const mysteryButton = () => {
    return (
      <button 
        onClick={mysteryHandler} 
        className='cta-button-two three-button'>
          Merch
      </button>
    )
  }

  const btn = () => {
    if (isLoading === false && isLoadingSecond === true) {
      return (
        <button 
          onClick={connectWalletHandler} 
          className='cta-button connect-wallet-button'>
          Welcome
        </button>
      )
    } else if (isLoading === true && isLoadingSecond === true) { 
      return (
        <button 
          onClick={verifyHandler} 
          className='cta-button verify-button'>
            Enter
        </button>
      )
    } else {
      return (
        <div className='main-app'>
        <div>
          <Stack spacing={4} direction='row'>
            {merchButton()}
            {utilityButton()}
            {virtualButton()}
            {mysteryButton()}
          </Stack>
        </div>
      </div>
      )
    }
  }

  return (
    <div className='main-app'>
       <div>
         {btn()}
       </div>
     </div>
  )
}

export default Auth;