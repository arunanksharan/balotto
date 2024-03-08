// Since HOST will be used multiple times across different files,
// let us load it in utils & import it everywhere

import { HOST } from "@/utils/loadEnv"

// Bring the screen from home api to here
export const HomeScreen = () => {
  const image = `${HOST}/api/image/?state=intro`

  return `
  <meta name="fc:frame" content="vNext">
  <meta property="og:image" content="${image}"
  <meta name="fc:frame:image" content="${image}">
  <meta name="fc:frame:post_url" content="${HOST}/api/home?state=introSelection"
  <meta property="fc:frame:button:1" content="Play" />
  <meta property="fc:frame:button:1" content="Account" />
  `
}
