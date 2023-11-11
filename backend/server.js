const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const app = express();
const port = 3000;

// Set up storage with multer (for demonstration purposes)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

    // Dummy code to save original and blurred images
    saveFile(req.file.buffer, "original"); // Save original
    saveFile(finalImage, "blurred"); // Save blurred

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
function saveFile(fileBuffer, type) {
  // Logic to save file to your secure storage
  console.log(`Saving ${type} file to secure storage.`);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
