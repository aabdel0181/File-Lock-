import { useState } from "react";

const ImageDataUpload = () => {
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-green-50 file:text-green-700
                     hover:file:bg-green-100"
      />
      {imagePreview && (
        <div className="mt-3">
          <img src={imagePreview} alt="Preview" className="max-w-xs max-h-64" />
        </div>
      )}
    </div>
  );
};

export default ImageDataUpload;
