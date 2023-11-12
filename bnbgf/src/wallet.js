// wallet.js

import Web3 from 'web3';

export const web3 = new Web3(window.ethereum);

export const connectWallet = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error(error);
  }
} 

export const getConnectedAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0]; 
}

