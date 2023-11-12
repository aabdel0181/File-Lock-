# obstructed_data
Allows user to upload data or NFT to BNB Greenfield 
# Decentralized Storage Dapp

This decentralized app allows users to securely store data like images, PDFs, and text while creating blurred versions of images for privacy. Powered by Binance Smart Chain, IPFS, and Greenfield.

## Features

- Upload images, PDFs, text files
- Create SECURED blurred/abstracted versions of images  
- Original files stored decentrally on IPFS
- Mint documents to represent ownership over files
- Manage and share uploaded data
- Pay gas fees using BNB cryptocurrency

## Technologies

- React - Frontend framework
- Express - Backend REST API
- Binance Smart Chain - Blockchain network 
- Greenfield - Decentralized file storage
- Sharp - Image processing library
- MetaMask - Ethereum/BNB wallet & authentication
- Web3.js - Blockchain/wallet integration

## Running the Dapp


1. Start the Express server

  
cd backend
npm install
node server.js


2. Start the React dev server


cd bnbgf
npm install
npm start


3. Connect MetaMask wallet to BSC testnet

4. Visit http://localhost:3001 to access the dapp

## Deployment 

The frontend can be built and deployed as static files. The Express server will need to be hosted on a service like Heroku with CORS enabled. The smart contract is deployed on the following address: 0xD9D3c8e08bF83Dc97E7699c786BDcF608886406D.

5. View Buckets in Dcellar (Object tx gets created and broadcasted) 
