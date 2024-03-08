// We will write client side code here to handle the redirect for the user depositing degen into the biconomy smart account wallet

// Need to explore this peice of code further to understand every specific detail
"use client"

import { DEGEN_TOKEN_ADDRESS_BASE_MAINNET } from "@/utils/addressesAndUrls"
import React, { useEffect, useRef } from "react"

const RedirectWallet = () => {
  const ref = useRef(null)

  function getAddressFromURI(uri: string) {
    const url = new URL(uri)

    const uriParam = url.searchParams.get("uri")

    if (uriParam) {
      const uriQuery = uriParam.split("?")[1]
      if (uriQuery) {
        const params = new URLSearchParams(uriQuery)
        return params.get("address")
      }
    }

    return ""
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const uri = url.searchParams.get("uri")

    // Extract receipient wallet address
    const receiverWallet = getAddressFromURI(window.location.href)

    // Using jumper exchange to deposit tokens into the biconomy wallet from user's wallet
    const desktopURI = `https://jumper.exchange/?fromChain=8453&toAddress=${receiverWallet}&toChain=8453&toToken=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.location.replace(uri ?? "/")
    } else {
      if (receiverWallet) {
        window.location.replace(desktopURI)
      }
    }

    console.log(uri)
  }, [])

  return (
    <div className="m-12 flex items-center justify-center">
      Redirecting you to fund your wallet...
      {/* <div ref={ref} id="qr-code" /> */}
    </div>
  )
}

export default RedirectWallet
