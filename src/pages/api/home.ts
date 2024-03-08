import { HOST } from "@/utils/loadEnv"
import { HomeScreen } from "@/screens/home"
import { NextApiRequest, NextApiResponse } from "next"
import { gameQueryState } from "@/types/GameQueryState"
import { getBiconomySmartAccount } from "@/biconomy/createSmartAccount"
import { getDegenBalance } from "@/utils/balance"
import {
  DEGEN_TOKEN_ADDRESS_BASE_MAINNET,
  getTokenDepositUri,
} from "@/utils/addressesAndUrls"
import { AccountPage } from "@/screens/account"
import { biconomyConfig } from "@/config/biconomyConfig"
import { redisClient } from "@/utils/redisClient"
import { supabaseClient } from "@/utils/supabaseClient"
import { Chains, NetworkType, Tokens } from "@/types/TokensEnum"
import { Network } from "ethers"
import { DepositInterface } from "@/types/supabase/Deposits"

const DEGEN_AMOUNT = 500 * 10 ** 18

// Let us refactor it to config and utils folder - redis connection

// Let us rewrite this whole api as an endpoint with proper types
const Home = async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the query params - state to track state of user interaction
  const { body, query } = req
  const gameState = query.state

  // The content to return to render the frame
  let content = ""

  // Extract which button was pressed and fid of user
  const buttonIndex = body.untrustedData?.buttonIndex
  const fid = body.untrustedData?.fid

  // 1. state == intro
  if (gameState === gameQueryState.intro) {
    content = HomeScreen()
  }

  // 2. state == introSelection
  if (gameState === gameQueryState.introSelection) {
    // check balance & route accordingly

    // Check which button was pressed
    if (buttonIndex == 1) {
      // Play Button was pressed

      // Let ths user deposit into biconomy smart account
      // Biconomy Smart Account is created for the user

      // I will continue this in the building session.
      // Also, I wil setup a supabase instead of redis to manage the raffle and deposits from users.

      const biconomyWallet = await getBiconomySmartAccount(fid)
      const recipient = (await biconomyWallet.getAccountAddress()) ?? ""

      // Store the deposit record in Supabase - assuming that user will deposit when they reach here
      // Need to check balance before moving to raffle contract through cronjob
      // farcasterId | biconomySmartAccount | token | amount | id + timestamp at supabase level

      const insertPayload: DepositInterface = {
        farcasterId: fid,
        biconomySmartAccount: recipient,
        token: Tokens.DEGEN,
        tokenAddress: DEGEN_TOKEN_ADDRESS_BASE_MAINNET,
        chainId: biconomyConfig.chainId,
        networkType: NetworkType.MAINNET,
        amount: DEGEN_AMOUNT,
      }

      const { data, error } = await supabaseClient
        .from("deposits")
        .insert(insertPayload)
        .select()
      console.log(data)
      console.log(error)

      const depositId = data?.[0]?.id ?? ""

      // Payment url
      const url = getTokenDepositUri({
        tokenAddress: DEGEN_TOKEN_ADDRESS_BASE_MAINNET,
        recipient,
        amount: DEGEN_AMOUNT,
        chainId: biconomyConfig.chainId,
      })

      //

      // Redirect to get user's signature for depositing into biconomy account
      res.status(302)

      // Let us now define the url to handle this redirect
      // Add additional parameters to inform the backend to initiate polling for checking balance of user for this given deposit id in supabase | Or we can ignore this entire thing and just check for balance at the time of starting raffle

      // For learning - let us do both

      res.setHeader(
        "Location",
        `${HOST}/redirect?uri=${url}&depositId=${depositId}`
      ) // Goto Webapp and handle polling for depositId
      res.end()
      return res
    } else {
      // Account button was pressed - route to AccountData page with associated address
      const biconomyWallet = await getBiconomySmartAccount(fid)

      if (!biconomyWallet.getAccountAddress()) {
        throw new Error("No biconomy wallet associated")
      }

      // Let us define the function getDegenBalance & AccountPage to return
      const biconomyAddress = await biconomyWallet.getAccountAddress()
      const balanceData = await getDegenBalance(
        biconomyAddress,
        DEGEN_TOKEN_ADDRESS_BASE_MAINNET
      )
      content = AccountPage(balanceData)
    }
  }

  // return content to render frames
  return res.status(200).send(`
  <!DOCTYPE html>
    <html>
        <head>
            <title>Let's Play Balotto</title>
            ${content}
        </head>
        <body>
            <p>You have already played!</p>
        </body>
    
    </html>
  
  `)
}

export default Home
