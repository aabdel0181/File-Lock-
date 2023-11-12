const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const mimeTypes = require("mime-types");
const { getCheckSums } = require("@bnb-chain/greenfiled-file-handle");
const { client, selectSp, generateString } = require("./client");
const { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } = require("./env");

// Set up storage with multer (for demonstration purposes)
const storage = multer.memoryStorage();
var upload = multer({
  dest: "uploads/",
  storage: multer.memoryStorage(),
});

app.use(cors());
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Process and blur image with sharp
    console.log("Image processing.......");

    // Load the image with Sharp
    const image = sharp(req.file.buffer);

    // Get metadata to calculate dimensions
    const metadata = await image.metadata();
    const halfWidth = Math.floor(metadata.width / 2);
    const height = metadata.height;

    // Create the cropped and blurred left half
    const blurredLeftHalf = await image
      .extract({ left: 0, top: 0, width: halfWidth, height: height })
      .blur(50)
      .toBuffer();

    // Composite the blurred left half over the original image
    const finalImage = await sharp(req.file.buffer)
      .composite([{ input: blurredLeftHalf, top: 0, left: 0 }])
      .toBuffer();

    // Send the final image
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": finalImage.length,
    });
    res.end(finalImage);

    // Respond with a success message and a new file
    console.log("SUCCESS!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing image.");
  }
});

// Dummy function for saving files (Replace with your actual storage logic)
async function saveFile(fileBuffer, type, acct, blur) {
  const spInfo = await selectSp();
  // Logic to save file to your secure storage
  console.log(`Saving ${type} file to secure storage.`);

  // create object example:
  const hashResult = await getCheckSums(fileBuffer);
  const { contentLength, expectCheckSums } = hashResult;

  console.log("creating the object....");
  if (blur) {
    const createObjectTx = await client.object.createObject(
      {
        bucketName: "uncensored-cats",
        objectName: "test_blur",
        creator: acct,
        visibility: "VISIBILITY_TYPE_PUBLIC_READ",
        fileType: fileType,
        redundancyType: "REDUNDANCY_EC_TYPE",
        contentLength,
        expectCheckSums: JSON.parse(expectCheckSums),
      },
      {
        type: "ECDSA",
        privateKey: ACCOUNT_PRIVATEKEY,
      }
    );
  } else {
    const createObjectTx = await client.object.createObject(
      {
        bucketName: "censored-cats",
        objectName: "test_noBlur",
        creator: acct,
        visibility: "VISIBILITY_TYPE_PRIVATE",
        fileType: fileType,
        redundancyType: "REDUNDANCY_EC_TYPE",
        contentLength,
        expectCheckSums: JSON.parse(expectCheckSums),
      },
      {
        type: "ECDSA",
        privateKey: ACCOUNT_PRIVATEKEY,
      }
    );
  }
  console.log("TX BUILT!");

  const createObjectTxSimulateInfo = await createObjectTx.simulate({
    denom: "BNB",
  });

  console.log("SIM BUILT!");

  const createObjectTxRes = await createObjectTx.broadcast({
    denom: "BNB",
    gasLimit: Number(createObjectTxSimulateInfo?.gasLimit),
    gasPrice: createObjectTxSimulateInfo?.gasPrice || "5000000000",
    payer: ACCOUNT_ADDRESS,
    granter: "",
    privateKey: ACCOUNT_PRIVATEKEY,
  });

  console.log("create object success", createObjectTxRes);
}

app.post(
  "/publish",
  upload.fields([
    { name: "originalImage", maxCount: 1 },
    { name: "blurredImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Publishing images...");

      if (
        !req.files ||
        !req.files["originalImage"] ||
        !req.files["blurredImage"]
      ) {
        return res.status(400).send("Files not uploaded.");
      }

      const originalImageBuffer = req.files["originalImage"][0].buffer;
      const blurredImageBuffer = req.files["blurredImage"][0].buffer;
      const account = req.body.account;

      saveFile(
        originalImageBuffer,
        0,
        account,
        req.files["originalImage"][0].mimetype
      );
      saveFile(blurredImageBuffer, 1, account, "image/jpeg");

      console.log(`Account: ${account}`);
      res
        .status(200)
        .json({ message: "Images published successfully", account: account });
    } catch (error) {
      console.error("Error in publishing:", error);
      res.status(500).send("Error in publishing images.");
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
