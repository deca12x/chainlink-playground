import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const { RPC_ENDPOINT_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: RPC_ENDPOINT_URL,
      accounts: ["0x" + PRIVATE_KEY],
    },
  },
};

export default config;
