import React, { useState, useEffect } from 'react';

const AccessList = ({ contract, account }) => {
  const [accessList, setAccessList] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAccessList = async () => {
    try {
      const list = await contract.sharedAccess();
      setAccessList(list);
    } catch (error) {
      console.error("Error fetching access list:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchAccessList();
    }
  }, [contract]);

  const handleAllow = async () => {
    if (!newAddress) {
      alert("Please enter an address");
      return;
    }

    try {
      setLoading(true);
      const transaction = await contract.allow(newAddress);
      await transaction.wait();
      setNewAddress("");
      alert("Access granted successfully!");
      fetchAccessList();
    } catch (error) {
      console.error("Error granting access:", error);
      alert("Error granting access. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisallow = async (address) => {
    try {
      setLoading(true);
      const transaction = await contract.disallow(address);
      await transaction.wait();
      alert("Access revoked successfully!");
      fetchAccessList();
    } catch (error) {
      console.error("Error revoking access:", error);
      alert("Error revoking access. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="access-list">
      <h2>Manage Access</h2>
      
      <div className="add-access">
        <input 
          type="text"
          placeholder="Enter address to share with"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button onClick={handleAllow} disabled={loading}>
          {loading ? "Processing..." : "Grant Access"}
        </button>
      </div>

      <div className="current-access">
        <h3>Current Access List</h3>
        {accessList.length > 0 ? (
          <ul>
            {accessList.map((item, index) => (
              <li key={index} className={item.access ? "active" : "inactive"}>
                <span>{item.user}</span>
                <span className="access-status">
                  {item.access ? "Active" : "Revoked"}
                </span>
                {item.access && (
                  <button 
                    className="revoke-btn" 
                    onClick={() => handleDisallow(item.user)}
                    disabled={loading}
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No access shared yet</p>
        )}
      </div>
    </div>
  );
};

export default AccessList;