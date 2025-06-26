import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfCarousel() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Handle successful loading of the PDF
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Navigation functions
  const goToPreviousPage = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>PDF Viewer</h1>
      <Document
        file="./display.pdf" // Path to the PDF in the public directory
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('Error loading PDF:', error)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <div>
        <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PdfCarousel;