// server-tasks.ts
import cron from "node-cron"
import { ethers } from "ethers"
import { supabaseClient } from "@/utils/supabaseClient"
import { DepositInterface } from "@/types/supabase/Deposits"

async function processDeposits(): Promise<void> {
  // Fetch user deposit records from Redis
  const { data: deposits, error } = await supabaseClient
    .from("deposits")
    .select("*")
    .gte("timestamp", new Date(Date.now() - 3600 * 1000).toISOString()) // Get deposits from the last hour

  if (error) {
    console.error("Error fetching deposits:", error)
    return
  }

  const aggDeposits: Record<string, number> = {}

  // need to parse amount to number if string
  deposits.forEach((deposit) => {
    const amountAsNumber =
      typeof deposit.amount === "string"
        ? parseFloat(deposit.amount)
        : deposit.amount

    aggDeposits[deposit.biconomySmartAccount] =
      (aggDeposits[deposit.biconomySmartAccount] || 0) + amountAsNumber
  })

  // Transfer tokens logic here
  // 1. Approve the raffle contract to spend the tokens
  // 2. Call deposit function on the raffle contract - it has the DEGEN.transferFrom logic
  // Use aggDeposits to transfer tokens to the raffle contract - use a batch transfer if possible

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string)
  // Interaction with the Biconomy and raffle contract would go here
  // This would likely involve calling other functions or methods, which should also be typed
}

// Schedule the task to run every hour
cron.schedule("0 * * * *", () => {
  console.log("Running deposit processing task")
  processDeposits()
})
