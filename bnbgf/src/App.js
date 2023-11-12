// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import Navbar from './Navbar';
import Home from './Home'; 
import Marketplace from './Marketplace';
import StoreData from './StoreData';
import Signin from './Signin';
import Web3 from 'web3';


export const web3 = new Web3(window.ethereum);


function App() {

  const theme = createTheme({
    palette: {
      background: {
        default: 'linear-gradient(#f4ede3, #e9dccc)'
      }
    }
  })

  const [account, setAccount] = useState(null);

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
      <Signin />
    : 
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store-data" element={<StoreData />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes> 
      </BrowserRouter>
    </ThemeProvider>
    }
    </>
  );
}

export default App;