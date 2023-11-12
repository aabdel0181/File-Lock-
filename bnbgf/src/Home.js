
import { 
  Container, 
  Typography,
  Box,
  useTheme  
} from '@mui/material';
import { Button, ButtonGroup } from '@mui/material';
import { Link } from "react-router-dom";


const Home = () => {
  const theme = useTheme();

  return (

    <Container 
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,

      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
        Filelock  
      </Typography>

      <Typography variant="subtitle1">
       A platform to protect and manage your digital assets.
      </Typography>


      <Box mt={4}>
      <ButtonGroup sx={{ '& > *': { m: 1 } }}>
      <Button size = "large" component={Link} to="/store-data">Upload Files</Button>
      <Button size = "large" component={Link} to="/marketplace">Marketplace</Button>
        </ButtonGroup>
      </Box>
      
    </Container>

  );
};

export default Home;
