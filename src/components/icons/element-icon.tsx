import * as React from "react"

import { Element } from "../../types"
import darkIconURL from "../../images/elements/dark.png"
import earthIconURL from "../../images/elements/earth.png"
import fireIconURL from "../../images/elements/fire.png"
import iceIconURL from "../../images/elements/ice.png"
import lightIconURL from "../../images/elements/light.png"
import windIconURL from "../../images/elements/wind.png"

const iconURLs: Record<Element, string> = {
  dark: darkIconURL,
  earth: earthIconURL,
  fire: fireIconURL,
  ice: iceIconURL,
  light: lightIconURL,
  wind: windIconURL,
}

const elementNameById: Record<Element, string> = {
  dark: "Dark",
  earth: "Earth",
  fire: "Fire",
  ice: "Ice",
  light: "Light",
  wind: "Wind",
}

export function ElementIcon({ element }: { element: Element }) {
  return (
    <div
      style={{
        width: "inherit",
        height: "inherit",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        src={iconURLs[element]}
        alt={elementNameById[element]}
      />
    </div>
  )
}
