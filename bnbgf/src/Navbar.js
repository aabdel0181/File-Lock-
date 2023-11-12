import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <ul className="flex space-x-4" >
        <li>
          
          <Link to="/" className="text-white">
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          </Link>
        </li>
        <li>
          <Link to="/store-data" className="text-white">
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Store Data
          </Typography>
          </Link>
        </li>
        <li>
          <Link to="/marketplace" className="text-white">
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Marketplace
          </Typography>
          </Link>
        </li>
        {/* <li>
            {account ? (
            <p>Connected: {account}</p>
          ) : null}
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
