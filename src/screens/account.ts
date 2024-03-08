import { HOST } from "@/utils/loadEnv"

export const AccountPage = (degenBalance: string) => {
  const balance = (Number(degenBalance) / 10 ** 18).toFixed(2)
  // Passing account detail and balance in query param to contrust image

  const image = `${HOST}/api/image?start=account&balance=${balance}`

  return `
    <meta name="fc:frame" content="vNext">
    <meta property="og:image" content="${image}">
    <meta name="fc:frame:image" content="${image}">
    <meta name="fc:frame:post_url" content="${HOST}/api/home?start=accountSelection">
    <meta property="fc:frame:button:1" content="Back" />
    <meta property="fc:frame:button:2" content="Withdraw" />
    <meta property="fc:frame:button:3" content="Deposit Degen" />
    <meta property="fc:frame:button:3:action" content="post_redirect" />
    <meta property="fc:frame:button:4" content="Explorer" />
    <meta property="fc:frame:button:4:action" content="post_redirect" />
    `
}
