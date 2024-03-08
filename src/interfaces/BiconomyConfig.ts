export interface BiconomyConfigInterface {
  privateKey: string
  accountIndex: number
  chainId: number
  rpcUrl: string
  bundlerUrl: string
  biconomyPaymasterUrl: string
  preferredToken: string
  numOfParallelUserOps: number
  tokenList: string[]
}
