import { useState } from "react";
import TextDataUpload from "./TextDataUpload"; // Subcomponent for text data upload
import ImageDataUpload from "./ImageDataUpload"; // Subcomponent for image data upload
import PdfDataUpload from "./PdfDataUpload";

const StoreData = () => {
  const [dataType, setDataType] = useState(null);

  return (
    <div>
      <div className="p-4">
        <button
          onClick={() => setDataType("text")}
          className="bg-blue-500 text-white p-2 m-2"
        >
          Store Text Data
        </button>
        <button
          onClick={() => setDataType("image")}
          className="bg-green-500 text-white p-2 m-2"
        >
          Store Image Data
        </button>

        <button
          onClick={() => setDataType("pdf")}
          className="bg-red-500 text-white p-2 m-2"
        >
          Store Pdf Data
        </button>

        {dataType === "text" && <TextDataUpload />}
        {dataType === "image" && <ImageDataUpload />}
        {dataType === "pdf" && <PdfDataUpload />}
      </div>
    </div>
  );
};

export default StoreData;
