import React, { useState } from "react";

const ImageDataUpload = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [blurredImage, setBlurredImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    console.log("Publishing.....");
  };

  const handleBlur = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        // Note: Fetch API does not require Content-Type header for FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const blurredImageUrl = URL.createObjectURL(imageBlob);
      setBlurredImage(blurredImageUrl);
    } catch (error) {
      console.error("Error blurring image:", error);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {imagePreview && (
        <>
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 max-w-xs max-h-64"
          />
          <button
            onClick={handleBlur}
            className="mt-2 py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600"
          >
            Blur
          </button>
        </>
      )}
      {blurredImage && (
        <>
          <img
            src={blurredImage}
            alt="Blurred"
            className="mt-3 max-w-xs max-h-64"
          />
          <button
            onClick={handlePublish}
            className="mt-2 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Publish
          </button>
        </>
      )}
    </div>
  );
};

export default ImageDataUpload;
