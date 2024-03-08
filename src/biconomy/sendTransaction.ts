import { ethers } from "ethers"
import { getBiconomySmartAccount } from "./createSmartAccount"

import { biconomyConfig } from "@/config/biconomyConfig"
import {
  DEGEN_TOKEN_ADDRESS_BASE_MAINNET,
  TREASURY_ADDRESS,
  BASE_MAIN_BLOCK_EXPLORER,
} from "@/utils/addressesAndUrls"
import { SendTransactionArgs } from "@/interfaces/SendTransactionInterface"
import abi from "@/abis/degenAbi.json"
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster"
import { buildBlockExplorerUrlFromHash } from "@/utils/utils"

// Let us now create an interface for the arguments send transaction will receive
// let us refactor and move it to types/interfaces folder to keep the code clean

export const sendTransaction = async ({
  fromAddress,
  toAddress,
  fid,
  amount,
}: SendTransactionArgs) => {
  console.log(
    `Sending ${amount} $DEGEN, from ${fromAddress} to ${toAddress} for Fid: ${fid}...`
  )
  try {
    const biconomySmartAccount = await getBiconomySmartAccount(fid)
    const abiInterface = new ethers.Interface(abi)

    // Let us create transaction data
    const txData = abiInterface.encodeFunctionData("transfer", [
      toAddress,
      ethers.parseEther(`${amount}`),
    ])

    const tx = {
      to: DEGEN_TOKEN_ADDRESS_BASE_MAINNET,
      data: txData,
    }

    // Let us create the userOp for this user transaction using biconomy sdk
    const userOp = await biconomySmartAccount.buildUserOp([tx])

    // Setting up paymaster to pay for the gas
    // Creating the information for the entrypoint to call the paymaster we had set up
    // ToDo: Look into paymaster documentation
    const paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: { name: "BICONOMY", version: "2.0.0" },
      calculateGasLimits: true,
    }

    const biconomyPaymaster =
      biconomySmartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>

    const paymasterAndDataResponse =
      await biconomyPaymaster.getPaymasterAndData(userOp, paymasterServiceData)

    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData

    if (
      paymasterAndDataResponse.callGasLimit &&
      paymasterAndDataResponse.verificationGasLimit &&
      paymasterAndDataResponse.preVerificationGas
    ) {
      userOp.callGasLimit = paymasterAndDataResponse.callGasLimit
      userOp.verificationGasLimit =
        paymasterAndDataResponse.verificationGasLimit
      userOp.preVerificationGas = paymasterAndDataResponse.preVerificationGas
    }

    const userOpResponse = await biconomySmartAccount.sendUserOp(userOp)

    const submittedTx = await userOpResponse.waitForTxHash()

    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    console.log("Transaction Hash: ", submittedTx.transactionHash)

    if (submittedTx.transactionHash) {
      console.log(
        "Transaction URL: ",
        buildBlockExplorerUrlFromHash(
          BASE_MAIN_BLOCK_EXPLORER,
          submittedTx.transactionHash
        )
      )
    }
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    return submittedTx.transactionHash
  } catch (error) {
    console.error(error)
  }
}
