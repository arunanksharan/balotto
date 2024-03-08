// Need Biconomy sdk - BiconomySmartAccountV2 + Entrypoint Address
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account"
import { Bundler } from "@biconomy/bundler"
import {
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
  ECDSAOwnershipValidationModule,
} from "@biconomy/modules"
import { BiconomyPaymaster } from "@biconomy/paymaster"

import { ethers } from "ethers"
import { biconomyConfig } from "@/config/biconomyConfig"

// Create Biconomy Smart Account for a Farcaster Fid

export const getBiconomySmartAccount = async (fid: number) => {
  // XXXXXXXXXXXXXXXXXXXXX USER (from whiteboard diagram) START XXXXXXXXXXXXXXXXXXX
  // Setting up provider and signer
  const provider = new ethers.JsonRpcProvider(biconomyConfig.rpcUrl)
  const signer = new ethers.Wallet(biconomyConfig.privateKey, provider)
  const eoa = await signer.getAddress()
  // XXXXXXXXXXXXXXXXXXXXX USER (from whiteboard diagram) END XXXXXXXXXXXXXXXXXXXXX

  // XXXXXXXXXXXXXXXXXXXXX BUNDLER (from whiteboard diagram) START XXXXXXXXXXXXXXXX
  const bundler = new Bundler({
    bundlerUrl: biconomyConfig.bundlerUrl,
    chainId: biconomyConfig.chainId,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  // XXXXXXXXXXXXXXXXXXXXX BUNDLER (from whiteboard diagram) END XXXXXXXXXXXXXXXXXXX

  // XXXXXXXXXXXXXXXXXXXXX PAYMASTER (from whiteboard diagram) START XXXXXXXXXXXXXXX
  const paymaster = new BiconomyPaymaster({
    paymasterUrl: biconomyConfig.biconomyPaymasterUrl,
  })
  // XXXXXXXXXXXXXXXXXXXXX PAYMASTER (from whiteboard diagram) END XXXXXXXXXXXXXXXXX

  // XXXXXXXXXXXXXXXXXXXXX ECDSA Module for VALIDATION START XXXXXXXXXXXXXXX

  // Need a bit more clarity over what is happening here
  const ecdsaModule = await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  })
  // XXXXXXXXXXXXXXXXXXXXX ECDSA Module for VALIDATION END XXXXXXXXXXXXXXX

  // XXXXXXXXXXXXXXXXXXXXX BICONOMY SMART ACCOUNT START XXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXX BICONOMY SMART ACCOUNT Config XXXXXXXXXXXXXXX
  const biconomySmartAccountConfig = {
    signer: signer,
    chainId: biconomyConfig.chainId,
    rpcUrl: biconomyConfig.rpcUrl,
    paymaster: paymaster,
    bundler: bundler,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: ecdsaModule,
    activeValidationModule: ecdsaModule,
    index: fid, // Farcaster Id is connected to biconomy smart account
  }

  const biconomySmartAccount = await BiconomySmartAccountV2.create(
    biconomySmartAccountConfig
  )

  const address = await biconomySmartAccount.getAccountAddress()
  return biconomySmartAccount
  // XXXXXXXXXXXXXXXXXXXXX BICONOMY SMART ACCOUNT END XXXXXXXXXXXXXXX
}

// So there you have it
// We used our signer + farcaster id as the index and create a biconomy smart account for the Farcaster user playing the game.
