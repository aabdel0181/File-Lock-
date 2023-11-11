import { useState } from "react";

const TextDataUpload = () => {
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
      />
      {fileContent && (
        <div className="mt-3 p-3 border border-gray-200">
          <p className="text-gray-600">{fileContent}</p>
        </div>
      )}
    </div>
  );
};

export default TextDataUpload;
