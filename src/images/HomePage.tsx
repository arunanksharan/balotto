import { HOST } from "@/utils/loadEnv"

// Need satori to render divs as images
import satori from "satori"

// Setting up fontdata

import * as fs from "fs"
import { join } from "path"
import path from "path"
import { wrapSatori } from "@/utils/wrapSatori"

export const HomePage = async () => {
  return wrapSatori(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${HOST}/home-bg.png)`,
      }}
    />
  )
}

// SO WHAT DOES SATORI DO?
// converts html and css into svg & supports reactjsx syntax
// requires the relevnt div/html and css + config options as second argument

// Since in this project, we will need to use satori for generating different images for frames
// we can abstract out a template for satori as a function wrapSatori & provide it with config and html
// let us create a wrapSatori in utils
