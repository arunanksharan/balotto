import * as fs from "fs"
import { join } from "path"
import { ReactElement } from "react"
import satori, { SatoriOptions } from "satori"

const fontPath = join(process.cwd(), "Ticketbit.woff")
const fontData = fs.readFileSync(fontPath)

const satoriConfig: SatoriOptions = {
  width: 586,
  height: 306,
  fonts: [
    {
      data: fontData,
      name: "Tickerbit",
      style: "normal",
      weight: 400,
    },
  ],
}

export const wrapSatori = (inputHtml: ReactElement) => {
  return satori(inputHtml, satoriConfig)
}
