import React, { useState } from 'react';

const FileUpload = ({ contract, account }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fileUrl) {
      alert("Please enter a file URL");
      return;
    }

    try {
      setLoading(true);
      const transaction = await contract.add(fileUrl);
      await transaction.wait();
      setFileUrl("");
      alert("File URL added successfully!");
    } catch (error) {
      console.error("Error adding file:", error);
      alert("Error adding file. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File URL</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter file URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;