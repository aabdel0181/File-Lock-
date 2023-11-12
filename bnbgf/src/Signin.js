import React from 'react'
import { Button, Box, Typography, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import Web3 from 'web3';
import metamaskImg from './metamask.png';


const Signin = () => {
    const connectWallet = async () => {
        const web3 = window.ethereum ? new Web3(window.ethereum) : null;

        if(!web3) {
            alert('Please Install Metamask');
            return; 
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
            window.location.reload()
        } catch(err) {
            console.error(err);
        }
    }
    
      return (
        <Box sx={{
            height: '100vh',
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(#f4ede3, #e9dccc)'
         }}>
            <Card sx={{ maxWidth: 345, padding: '50px'}}>
                <CardMedia
                    sx={{
                        // opacity: 0.7,
                        // position: 'absolute',
                        // top: -50, 
                        // left: '50%',
                        // transform: 'translateX(-50%)'
                    }}
                    component="img"
                    alt="metamask"
                    height="140"
                    image={metamaskImg}
                />
                <CardContent sx={{ p: 3 }} />
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button size="medium" onClick = {connectWallet}>Connect your wallet</Button>
                </CardActions>
            </Card>
        </Box>
      )
}

export default Signin