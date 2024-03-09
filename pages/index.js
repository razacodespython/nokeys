import { ethers } from "ethers";
import React, { useState } from "react";

export default function Home() {
  // Extracted ABI from your provided JSON
  const [deploymentInfo, setDeploymentInfo] = useState("");
  const [abi, setAbi] = useState("");
  const [bytecode, setBytecode] = useState("");

  const [fileContent, setFileContent] = useState("");
  const [contractDetails, setContractDetails] = useState({
    abi: null,
    bytecode: null,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target.result;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const loadContractDetails = async () => {
    try {
      const jsonData = await JSON.parse(fileContent);
      setContractDetails({
        abi: jsonData.abi,
        bytecode: jsonData.bytecode,
      });
  
      // Use jsonData directly to update abi and bytecode
      setAbi(jsonData.abi);
      setBytecode(jsonData.bytecode.object); // Assuming bytecode is an object with an 'object' property
  
      console.log(abi);
      console.log(bytecode) // Log jsonData to see the immediate update
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Failed to parse the contract file. Make sure it's a valid JSON.");
    }
  };
  const contractABI = abi;
  // Extracted bytecode from your provided JSON (simplified example, replace with actual bytecode)
  const contractBytecode = bytecode;

  async function deployContract() {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractFactory = new ethers.ContractFactory(
      contractABI,
      contractBytecode,
      signer
    );

    try {
      const contract = await contractFactory.deploy();
      await contract.deployed();
      setDeploymentInfo(`Contract deployed to: ${contract.address}`);
    } catch (error) {
      console.error("Contract deployment failed:", error);
      setDeploymentInfo("Contract deployment failed. See console for details.");
    }
  }
  return (
    <div>
      <button onClick={deployContract}>Deploy Contract</button>
      {deploymentInfo && <p>{deploymentInfo}</p>}
      <div>
        <input type="file" onChange={handleFileChange} accept=".json" />
        <button onClick={loadContractDetails} disabled={!fileContent}>
          Load Contract
        </button>
        {contractDetails.abi && (
          <div>
            <h3>ABI:</h3>
            <pre>{JSON.stringify(contractDetails.abi, null, 2)}</pre>
          </div>
        )}
        {contractDetails.bytecode && (
          <div>
            <h3>Bytecode:</h3>
            {/* Ensure you're accessing the bytecode string correctly */}
            <pre>{contractDetails.bytecode.object}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
