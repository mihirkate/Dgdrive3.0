import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        try {
          await provider.send("eth_requestAccounts", []);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("User denied account access:", error);
        }

        const signer = provider.getSigner();
        const contractAddress = "0x27B21D32fB1b71ed56b6f610149e5FC0451b24f6"; // Update with your contract address
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract);

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            console.log("No accounts connected");
            setAccount("");
          } else {
            setAccount(accounts[0]);
          }
        });
      } else {
        console.error("MetaMask is not installed. Please install it.");
      }
    };

    loadProvider();
  }, []);

  return (
    <div className="App">
      <h1 style={{ color: "white" }}>Gdrive 3.0</h1>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <p style={{ color: "white" }}>
        Account: {account ? account : "Not connected"}
      </p>

      <FileUpload account={account} provider={provider} contract={contract} />
      <Display contract={contract} account={account} />

      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}

      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}
    </div>
  );
}

export default App;
