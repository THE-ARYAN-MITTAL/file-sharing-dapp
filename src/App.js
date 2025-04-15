import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { sharingAbi, contractAddress } from './contracts/SharingContract';
import './App.css';
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Modal from './components/Modal';
import AccessList from './components/AccessList';
function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sharingFiles, setSharingFiles] = useState(false);
  const [viewingAddress, setViewingAddress] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [toast, setToast] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          const contract = new ethers.Contract(
            contractAddress,
            sharingAbi,
            signer
          );
          setContract(contract);
          setProvider(provider);
        } else {
          showToast("Please install MetaMask to use this application", 'error');
        }
      } catch (error) {
        showToast("Error connecting to blockchain", 'error');
      }
    };
    loadBlockchainData();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        showToast("Wallet connected!", 'success');
      } else {
        showToast("Please install MetaMask to use this application", 'error');
      }
    } catch (error) {
      showToast("Error connecting wallet", 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="App">
      {}
      <header className="App-header hero-section">
        {}
        <h1>Decentralized File Sharing</h1>
        <p className="hero-tagline">Experience the future of secure, beautiful sharing. Lightning fast. Ultra secure. Unbelievably gorgeous.</p>
        {!account ? (
          <button className="connect-wallet-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p>Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
        )}
      </header>

      {}
      {showOnboarding && (
        <div className="modal-background" style={{zIndex: 2000}}>
          <div className="modal-content" style={{maxWidth: 400, textAlign: 'center'}}>
            <h2>🚀 Welcome!</h2>
            <p>Upload, share, and control your files with style.<br/>Connect your wallet to begin.</p>
            <button onClick={() => setShowOnboarding(false)} style={{marginTop: 20}}>Get Started</button>
          </div>
        </div>
      )}

      {}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {}
      {}

      <div className="container">
        {account && (
          <>
            <div className="main-section">
              <FileUpload contract={contract} account={account} onSuccess={handleCelebrate} onError={showToast} />
              <Display contract={contract} account={account} setModalOpen={setModalOpen} setSharingFiles={setSharingFiles} setViewingAddress={setViewingAddress} onError={showToast} />
              <AccessList contract={contract} account={account} onError={showToast} />
            </div>
            {modalOpen && (
              <Modal setModalOpen={setModalOpen} contract={contract} sharingFiles={sharingFiles} viewingAddress={viewingAddress} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;