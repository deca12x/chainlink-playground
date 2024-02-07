import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import { CCIPTokenSenderFujiSepolia__factory } from "../typechain-types";

async function main() {
  // CONFIGURE PROVIDER & WALLET
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const CCIPSenderFactory = new CCIPTokenSenderFujiSepolia__factory(wallet);

  // DEPLOY CCIP SENDER CONTRACT
  const CCIPSenderContract = await CCIPSenderFactory.deploy();
  await CCIPSenderContract.waitForDeployment();
  const senderContractAddress = await CCIPSenderContract.getAddress();
  console.log("senderContractAddress", senderContractAddress);

  // INTERACT WITH EXISTING CONTRACT (not needed here)
  // const CCIPSenderContract = CCIPSenderFactory.attach(senderContractAddress) as CCIPTokenSenderFujiSepolia;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
