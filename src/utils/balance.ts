export const getDegenBalance = async (
  address: string,
  tokenAddress: string
) => {
  // Use basescan api to fetch balance of degen token for the given address
  const balanceData = await fetch(
    `https://api.basescan.org/api?module=account&action=tokenbalance&contractAddress=${tokenAddress}&address=${address}&tag=latest&apikey=<basescan_apikey>`
  )

  const data = await balanceData.json()
  const { result } = data

  return result
}
