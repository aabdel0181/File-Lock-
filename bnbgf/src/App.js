// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './Home'; 
import Marketplace from './Marketplace';
import StoreData from './StoreData';

import Web3 from 'web3';
import { web3 } from './wallet';

function App() {

  const [account, setAccount] = useState(null);
  const connectWallet = async () => {
    const web3 = window.ethereum ? new Web3(window.ethereum) : null;

    if(!web3) {
      alert('Please Install Metamask');
      return; 
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
      setAccount(accounts[0]);
    } catch(err) {
      console.error(err);
    }
  }

  // const isConnected = async () => {
  //   const web3 = new Web3(window.ethereum);
  //   const accounts = await web3.eth.getAccounts();
  //   console.log(accounts);
  //   return accounts && accounts.length > 0;
  // };


  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    getAccount();
  }, []);

  return (
    <>
    {!account ? 
    <div className="modal">
      <p>Please sign in with MetaMask</p>
      <button onClick={connectWallet}> Connect Wallet </button>
    </div>
    : 
      <BrowserRouter>
        <Navbar />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/store-data" element={<StoreData />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes> 
      </BrowserRouter>
    }
    </>
  );
}

export default App;