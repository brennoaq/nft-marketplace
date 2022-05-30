const { ethers} = require('hardhat');
async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:

  // The factory we use for deploying contracts
  const NFT = await ethers.getContractFactory("NFT");
  console.log('Deploying NFT...');
  const Marketplace = await ethers.getContractFactory("Marketplace");
  console.log('Deploying Marketplace...');

 // Deploy an instance of the contract
  const nft = await NFT.deploy();
  const marketplace = await Marketplace.deploy(1);

  await nft.deployed();
  await marketplace.deployed();
  
  console.log('NFT deployed to:', nft.address);
  console.log('Marketplace deployed to:', marketplace.address);

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(nft, "NFT");
  saveFrontendFiles(marketplace, "Marketplace");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
