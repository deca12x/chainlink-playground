import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import { promises as fsPromises } from "fs";

const TOKEN_CONTRACT_ADDRESS = "0x4717B57d1d73bb50c5dE780abE0a11876e60Bd6A";
const TOKENSHOP_CONTRACT_ADDRESS = "0x9B74F89b6DBE2519aC66CA611CB3a9bBD638B689";
const ABI_FILE_PATH = "../artifacts/contracts/Token.sol/Token.json";

async function getAbi() {
  const data = await fsPromises.readFile(ABI_FILE_PATH, "utf8");
  const abi = JSON.parse(data)["abi"];
  return abi;
}

async function main() {
  // CONFIGURE PROVIDER & WALLET
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  // DEPLOY CONTRACT
  // const TokenFactory = await hre.ethers.getContractFactory("Token");
  // const Token = await TokenFactory.deploy();

  // INTERACT WITH EXISTING CONTRACT
  // const abi = await getAbi();
  // const TokenContract = new ethers.ContractFactory(
  //   TOKEN_CONTRACT_ADDRESS,
  //   abi,
  //   wallet
  // );

  // grantRole takes 2 args: role(bytes32), account(address)
  // const grantRoleTx = await TokenContract.grantRole(
  //   ethers.encodeBytes32String("MINTER_ROLE"),
  //   TOKENSHOP_CONTRACT_ADDRESS
  // );
  // const grantRoleTxReceipt = await grantRoleTx.wait();
  // console.log("grantRoleTxReceipt", grantRoleTxReceipt);

  const tx = await wallet.sendTransaction({
    to: TOKENSHOP_CONTRACT_ADDRESS,
    value: ethers.utils.parseUnits("0.001", "ether"),
  });
  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
