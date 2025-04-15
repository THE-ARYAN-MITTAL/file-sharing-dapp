import React, { useState, useEffect } from 'react';

const Modal = ({ setModalOpen, contract, sharingFiles, viewingAddress }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const filesData = await contract.display(viewingAddress);
        setFiles(filesData);
        setError("");
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Access denied or error fetching files");
      } finally {
        setLoading(false);
      }
    };

    if (contract && viewingAddress) {
      fetchFiles();
    }
  }, [contract, viewingAddress]);

  return (
    <div className="modal-background">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{sharingFiles ? "Shared Files" : "My Files"}</h2>
          <button className="close-btn" onClick={() => setModalOpen(false)}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <p>Loading files...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : files.length > 0 ? (
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;