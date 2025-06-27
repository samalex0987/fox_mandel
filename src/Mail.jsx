import React, { useState } from 'react';
import axios from 'axios';

function PdfUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/send-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("Upload success: " + response.data.message);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Upload failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Send PDF to Server</button>
      <p>{status}</p>
    </div>
  );
}

export default PdfUploader;
