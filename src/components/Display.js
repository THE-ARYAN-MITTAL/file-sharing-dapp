import React, { useState } from 'react';

const Display = ({ contract, account, setSharingFiles, setViewingAddress, setModalOpen }) => {
  const [userAddress, setUserAddress] = useState("");

  const getMyFiles = async () => {
    try {
      setSharingFiles(false);
      setViewingAddress(account);
      setModalOpen(true);
    } catch (error) {
      console.error("Error getting files:", error);
      alert("Error getting files. Check console for details.");
    }
  };

  const getSharedFiles = async () => {
    if (!userAddress) {
      alert("Please enter an address");
      return;
    }

    try {
      setSharingFiles(true);
      setViewingAddress(userAddress);
      setModalOpen(true);
    } catch (error) {
      console.error("Error getting shared files:", error);
      alert("Error getting shared files. Check console for details.");
    }
  };

  return (
    <div className="file-display">
      <h2>View Files</h2>
      <div className="my-files">
        <button onClick={getMyFiles}>View My Files</button>
      </div>

      <div className="shared-files">
        <h3>View Shared Files</h3>
        <input 
          type="text"
          placeholder="Enter address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button onClick={getSharedFiles}>View Shared Files</button>
      </div>
    </div>
  );
};

export default Display;