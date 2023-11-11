import { useState } from "react";
import { Document, Page } from "react-pdf";

// Set worker
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfDataUpload = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-5 flex">
      <div className="w-1/2 flex flex-col items-start ml-2">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-2"
        />
        {file && (
          <>
            <div className="flex items-center mb-2">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className="ml-2"
              >
                Previous
              </button>
              <p className="mx-2">
                Page {pageNumber} of {numPages}
              </p>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
                className="ml-auto w-max"
              >
                Next
              </button>
            </div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} renderTextLayer={false} />
            </Document>
          </>
        )}
      </div>
      <div className="w-1/2">{/* Other content or empty space */}</div>
    </div>
  );
};

export default PdfDataUpload;
