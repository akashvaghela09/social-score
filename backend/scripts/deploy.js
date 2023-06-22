// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeploying contracts with the account:", deployer.address);

  const SSToken = await ethers.getContractFactory("SSToken");
  const SocialScore = await ethers.getContractFactory("SocialScore");
  const Community = await ethers.getContractFactory("Community");

  const ssToken = await SSToken.deploy();
  await ssToken.deployed();
  console.log("\nSuccess! ssToken \ndeployed to:", ssToken.address);

  const socialScore = await SocialScore.deploy(ssToken.address);
  await socialScore.deployed();
  console.log("\nSuccess! socialScore \ndeployed to:", socialScore.address);

  const community = await Community.deploy(socialScore.address);
  await community.deployed();
  console.log("\nSuccess! community \ndeployed to:", community.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
