const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("./src");

task("chain-id", "Prints the current chain ID").setAction(
  async (taskArgs, hre) => {
    const network = await hre.ethers.provider.getNetwork();
    console.log(`Chain ID: ${network.chainId}`);
  },
);

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-lock", "Deploys the Lock contract")
  // .addParam("unlocktime", "The unlock time (timestamp)") // Accepts an unlock time as argument
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const [deployer] = await ethers.getSigners(); // Get deployer's account
    console.log(`Deploying contract with account: ${deployer.address}`);
    // console.log("deployer.provider:", deployer.provider)

    // Compile the contract
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(
      Math.floor(new Date().getTime() / 1000) + 1000 * 24 * 60 * 60,
    ); // Deploy with unlockTime argument
    await lock.deployed(); // Wait until deployed

    console.log(`Lock deployed at address: ${lock.address}`);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    tenderly: {
      url: "https://virtual.base.rpc.tenderly.co/...",
      tendrlySignerAddress: "0x1111111222233333333333333333333333333333",
    },
  },
};
