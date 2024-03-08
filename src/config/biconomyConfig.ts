import { PRIVATE_KEY } from "./loadPrivateKey"
import { BiconomyConfigInterface } from "@/interfaces/BiconomyConfig"

export const CHAIN_ID = 8453

export const biconomyConfig: BiconomyConfigInterface = {
  privateKey: PRIVATE_KEY,
  accountIndex: 0, // Unfamiliar with this as well yet
  chainId: CHAIN_ID,
  rpcUrl: "https://mainnet.base.org",
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${CHAIN_ID}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // Will update actual mainnet url later when offline (LoL)
  biconomyPaymasterUrl: `https://paymaster.biconomy.io/api/v1/${CHAIN_ID}/<api_key>`,
  // Found a few other config parameters I am not familiar with yet - will look into this deeper
  preferredToken: "",
  numOfParallelUserOps: 1,
  tokenList: [],
}
