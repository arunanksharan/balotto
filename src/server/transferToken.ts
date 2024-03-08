import { ethers } from "ethers"

// Assuming you have the types for your contract's ABI.
// If you don't have specific types, you can use any[] for the ABI.
// The proper type for an ABI is any[], but you can define more specific types based on your contract.
interface TokenContract extends ethers.Contract {
  transfer: (
    address: string,
    amount: string
  ) => Promise<ethers.ContractTransaction>
}

// Ensure you have the correct environment variable types defined somewhere in your project,
// or use a more general approach as shown below.
declare const process: {
  env: {
    RPC_URL: string
    PRIVATE_KEY: string
  }
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

// You need to define `tokenAddress` and `tokenAbi` based on your contract
const tokenAddress: string = "..." // The address of your token contract
const tokenAbi: any[] = [] // The ABI of your token contract

const tokenContract: TokenContract = new ethers.Contract(
  tokenAddress,
  tokenAbi,
  signer
) as TokenContract
const raffleContractAddress: string = "..." // Your raffle contract address

async function transferTokens(
  walletAddress: string,
  amount: string
): Promise<void> {
  // The method signature may vary based on your contract's implementation.
  // Adjust the call accordingly.
  const tx = await tokenContract.transfer(raffleContractAddress, amount)
  await tx.wait()
  console.log(
    `Transferred ${amount} tokens from ${walletAddress} to raffle contract.`
  )
}
