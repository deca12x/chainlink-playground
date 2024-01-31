import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import {
  Token,
  Token__factory,
  TokenShop,
  TokenShop__factory,
} from "../typechain-types";

async function main() {
  // CONFIGURE PROVIDER & WALLET
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const TokenFactory = new Token__factory(wallet);
  const TokenShopFactory = new TokenShop__factory(wallet);

  // DEPLOY TOKEN CONTRACT
  const TokenContract = await TokenFactory.deploy();
  await TokenContract.waitForDeployment();
  const myTokenAddress = await TokenContract.getAddress();
  console.log("myTokenAddress", myTokenAddress);

  // DEPLOY TOKENSHOP CONTRACT
  const TokenShopContract = await TokenShopFactory.deploy(myTokenAddress);
  await TokenShopContract.waitForDeployment();
  const myTokenShopAddress = await TokenShopContract.getAddress();
  console.log("myTokenShopAddress", myTokenShopAddress);

  // INTERACT WITH EXISTING CONTRACT (not needed here)
  // const TokenContract = TokenFactory.attach(myTokenAddress) as Token;

  // grantRole takes 2 args: role(kekkac the MINTER_ROLE string to get bytes32), account(address)
  const grantRoleTx = await TokenContract.grantRole(
    ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")),
    myTokenShopAddress
  );
  const grantRoleTxReceipt = await grantRoleTx.wait();
  console.log("grantRoleTxReceipt", grantRoleTxReceipt);

  // ASK TOKEN CONTRACT WHO IS MINTER
  const tokenShopHasRole = await TokenContract.hasRole(
    ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")),
    myTokenShopAddress
  );
  console.log("tokenShopHasRole", tokenShopHasRole);

  // CHECK TOKEN BALANCE OF WALLET
  const tokenBalance = await TokenContract.balanceOf(wallet.address);
  console.log("tokenBalance", tokenBalance.toString());

  // SEND ETH TO TOKENSHOP aka MINT NEW ERC20 TOKENS (RECEIVE FALLLBACK FUNCTION)
  const tx = await wallet.sendTransaction({
    to: myTokenShopAddress,
    value: ethers.parseEther("0.001"),
  });
  const txReceipt = await tx.wait();
  console.log(txReceipt);

  // CHECK TOKEN BALANCE OF WALLET
  const tokenBalanceAfter = await TokenContract.balanceOf(wallet.address);
  console.log("tokenBalance", tokenBalanceAfter.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
