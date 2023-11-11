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
        className="..."
      />
      {imagePreview && (
        <>
          <img src={imagePreview} alt="Preview" className="..." />
          <button onClick={handleBlur} className="...">
            Blur
          </button>
        </>
      )}
      {blurredImage && <img src={blurredImage} alt="Blurred" className="..." />}
    </div>
  );
};

export default ImageDataUpload;
