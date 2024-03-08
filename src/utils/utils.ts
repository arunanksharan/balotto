export const buildBlockExplorerUrlFromHash = (
  blockExplorerUrl: string,
  hash: string
) => {
  return `${blockExplorerUrl}/tx/${hash}`
}
