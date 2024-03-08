// When API is called - `HOST/api/image?state=intro`

import { HomePage } from "@/images/HomePage"
import { gameQueryState } from "@/types/GameQueryState"
import { GameState } from "@/types/GameState"
import { HOST } from "@/utils/loadEnv"
import type { NextApiRequest, NextApiResponse } from "next"
import sharp from "sharp"

export const dynamic = "force-dynamic" // Fresh fetch on every request

// Let's gooo! Image API

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req

  const gameState = query.state as GameState // Addition of a new type GameState is needed

  let svg = ""

  if (gameState === gameQueryState.intro) {
    svg = await HomePage() // HomePage is fetched from a separate folder images - where actual images are created - ideally should form part of pages router or app router

    // API => Image API => HomePage
  }
  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer()

  // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png")
  res.setHeader("Cache-Control", "max-age=10")
  res.send(pngBuffer)
}
