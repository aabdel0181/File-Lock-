import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Web3 from 'web3';

export const web3 = new Web3(window.ethereum);

const Marketplace = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    getAccount();
  }, []);  
  
  return (
    <div>

      <div className="p-4">
        {/* Marketplace content here */}
        <p>{account}</p>
      </div>
    </div>
  );
};

export default Marketplace;
