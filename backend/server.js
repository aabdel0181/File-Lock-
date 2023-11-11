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

    const blurredImage = await sharp(req.file.buffer)
      .blur(10) // Apply blur - adjust value as needed
      .toBuffer();
    console.log("Image blurred. Saving.........");
    // Dummy code to save original and blurred images
    saveFile(req.file.buffer, "original"); // Save original
    saveFile(blurredImage, "blurred"); // Save blurred

    // Respond with a success message and a new file
    res.status(200).send(blurredImage);
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
