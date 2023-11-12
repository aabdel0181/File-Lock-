import TextDataUpload from "./TextDataUpload"; // Subcomponent for text data upload
import ImageDataUpload from "./ImageDataUpload"; // Subcomponent for image data upload
import PdfDataUpload from "./PdfDataUpload";
import { useState, useEffect } from "react";

// Clean fonts, colors, whitespace
import {
  Typography,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";

// Animations
import { motion } from "framer-motion";
import Web3 from "web3";
export const web3 = new Web3(window.ethereum);

const StoreData = () => {
  const [dataType, setDataType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [account, setAccount] = useState(null);

  const handleSelected = (event, newSelected) => {
    setSelected(newSelected);
  };

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    getAccount();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, md: 10 },
          mt: "5%",
        }}
      >
        <Typography variant="h2" sx={{ mb: 4 }}>
          Store and protect your important data.
        </Typography>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, md: 10 },
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={selected}
            onChange={handleSelected}
          >
            <ToggleButton onClick={() => setDataType("text")} value="text">
              Store Text Data
            </ToggleButton>
            <ToggleButton onClick={() => setDataType("image")} value="image">
              Store Image Data
            </ToggleButton>

            <ToggleButton onClick={() => setDataType("pdf")} value="pdf">
              Store Pdf Data
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>

        {dataType === "text" && <TextDataUpload />}
        {dataType === "image" && <ImageDataUpload />}
        {dataType === "pdf" && <PdfDataUpload />}
      </Container>
    </motion.div>
  );
};

export default StoreData;
