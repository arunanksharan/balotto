import { TokenDepositUriInterface } from "@/interfaces/TokenDepositUri"

export const DEGEN_TOKEN_ADDRESS_BASE_MAINNET =
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
export const TREASURY_ADDRESS = "<COMPANYTREASURY>"
export const BASE_MAIN_BLOCK_EXPLORER = "https://basescan.org"

export const getTokenDepositUri = ({
  tokenAddress,
  recipient,
  chainId,
  amount,
}: TokenDepositUriInterface) => {
  const tokenDepositUri = `ethereum:${tokenAddress}@${chainId}/transfer?address=${recipient}&uint256=${amount}`
  return tokenDepositUri
}
