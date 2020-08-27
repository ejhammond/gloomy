import * as React from "react"
import Typography from "@material-ui/core/Typography"

import {
  AttackModifierCard as AttackModifierCardType,
  InfuseAspect,
  StatusAspect,
  NumericalAspect,
} from "../../types"
import { statuses } from "../../configs/statuses"
import { ElementIcon } from "../icons/element-icon"
import { HealIcon } from "../icons/heal-icon"
import { DiamondIcon } from "../icons/diamond-icon"
import { PierceIcon } from "../icons/pierce-icon"
import { PushIcon } from "../icons/push-icon"
import { PullIcon } from "../icons/pull-icon"
import { ShieldIcon } from "../icons/shield-icon"
import { ShuffleIcon } from "../icons/shuffle-icon"
import { RefreshItemIcon } from "../icons/refresh-item-icon"
import { AspectRatio } from "../aspect-ratio"
import { attackModifierCardToString } from "./text"

import blessingImageURL from "../../images/card-layers/blessing.png"
import criticalImageURL from "../../images/card-layers/critical.png"
import curseImageURL from "../../images/card-layers/curse.png"
import minus1ImageURL from "../../images/card-layers/minus-1.png"
import minus2ImageURL from "../../images/card-layers/minus-2.png"
import missImageURL from "../../images/card-layers/miss.png"
import neutralImageURL from "../../images/card-layers/neutral.png"
import plus1ImageURL from "../../images/card-layers/plus-1.png"
import plus2ImageURL from "../../images/card-layers/plus-2.png"
import plus3ImageURL from "../../images/card-layers/plus-3.png"
import plus4ImageURL from "../../images/card-layers/plus-4.png"
import frontImageURL from "../../images/card-layers/front.jpg"

function Aspect({
  aspect,
}: {
  aspect:
    | AttackModifierCardType["primaryAspect"]
    | AttackModifierCardType["secondaryAspect"]
}) {
  const { type } = aspect

  if (type === "infuse") {
    const infuseAspect = aspect as InfuseAspect
    return <ElementIcon element={infuseAspect.value} />
  }

  if (type === "heal") {
    const healAspect = aspect as NumericalAspect
    return (
      <div
        style={{ position: "relative", width: "inherit", height: "inherit" }}
      >
        <HealIcon />
        <Typography
          component="span"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            color: "white",
            fontFamily: "Pirata One",

            paddingTop: "15%", // the text looks better when we fudge it down a bit
          }}
        >
          +{healAspect.value}
        </Typography>
      </div>
    )
  }

  if (type === "shield") {
    const shieldAspect = aspect as NumericalAspect
    return (
      <div
        style={{ position: "relative", width: "inherit", height: "inherit" }}
      >
        <ShieldIcon />
        <Typography
          component="span"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            color: "white",
            fontFamily: "Pirata One",
          }}
        >
          +{shieldAspect.value}
        </Typography>
      </div>
    )
  }

  if (type === "refresh-item") {
    return <RefreshItemIcon />
  }

  if (type === "pierce") {
    const numericalAspect = aspect as NumericalAspect
    return <PierceIcon value={numericalAspect.value} />
  }

  if (type === "push") {
    const numericalAspect = aspect as NumericalAspect
    return <PushIcon value={numericalAspect.value} />
  }

  if (type === "pull") {
    const numericalAspect = aspect as NumericalAspect
    return <PullIcon value={numericalAspect.value} />
  }

  if (["add-target", "add-curse", "add-blessing"].includes(type)) {
    // @ts-ignore type is guaranteed to be add-target, add-curse or add-blessing
    return <DiamondIcon type={type} />
  }

  if (type === "status") {
    const statusAspect = aspect as StatusAspect
    return <DiamondIcon type={statusAspect.value} />
  }

  throw new Error("Unrecognized aspect " + type)
}

const colors = {
  red: "330deg",
  green: "60deg",
  brown: "0deg",
  yellow: "30deg",
  purple: "250deg",
}

function aspectToColor(
  aspect: AttackModifierCardType["primaryAspect"],
): keyof typeof colors {
  switch (aspect.type) {
    case "damage":
      if (aspect.value < 0) {
        return "red"
      } else if (aspect.value > 0) {
        return "green"
      } else {
        return "brown"
      }
    case "miss":
    case "curse":
      return "yellow"
    case "critical":
    case "blessing":
      return "purple"
    default:
      return "brown"
  }
}

const layerURLs = {
  "minus-2": minus2ImageURL,
  "minus-1": minus1ImageURL,
  neutral: neutralImageURL,
  "plus-1": plus1ImageURL,
  "plus-2": plus2ImageURL,
  "plus-3": plus3ImageURL,
  "plus-4": plus4ImageURL,
  miss: missImageURL,
  critical: criticalImageURL,
  blessing: blessingImageURL,
  curse: curseImageURL,
}

function aspectToLayer(
  aspect:
    | AttackModifierCardType["primaryAspect"]
    | AttackModifierCardType["secondaryAspect"],
): keyof typeof layerURLs {
  if (aspect.type === "damage") {
    const damageAspect = aspect as NumericalAspect

    switch (damageAspect.value) {
      case -2:
        return "minus-2"
      case -1:
        return "minus-1"
      case 0:
        return "neutral"
      case 1:
        return "plus-1"
      case 2:
        return "plus-2"
      case 3:
        return "plus-3"
      case 4:
        return "plus-4"
      default:
        throw new Error("Unsupported damage value " + damageAspect.value)
    }
  }

  if (["miss", "curse", "blessing", "critical"].includes(aspect.type)) {
    return aspect.type as "miss" | "curse" | "blessing" | "critical"
  }

  throw new Error(
    "Aspect " + aspect.type + " does not have a corresponding layer",
  )
}

function AttackModifierCardLayer({ layer }: { layer: keyof typeof layerURLs }) {
  return (
    <img
      style={{
        zIndex: 2,

        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
      }}
      src={layerURLs[layer]}
    />
  )
}
export function FullAttackModifierCard({
  card,
}: {
  card: AttackModifierCardType
}) {
  const { rolling = false, primaryAspect, secondaryAspect, shuffle } = card

  return (
    <AspectRatio aspectRatio={296 / 437}>
      <div
        title={attackModifierCardToString(card)}
        style={{
          position: "relative",
          overflow: "hidden",

          fontFamily: "Pirata One",

          boxSizing: "border-box",
          height: "100%",
          width: "100%",

          display: "grid",
          gridTemplateColumns: "25% 50% 25%",
          gridTemplateRows: "30% 40% 30%",

          padding: 8,

          border: "1px solid black",
          borderRadius: "4%",
        }}
      >
        <div
          style={{
            zIndex: 1,

            position: "absolute",
            top: 0,
            left: 0,

            height: "100%",
            width: "100%",

            backgroundImage: `url("${frontImageURL}")`,
            backgroundSize: "cover",
            filter: `hue-rotate(${colors[aspectToColor(primaryAspect)]})`,
          }}
        />
        {["damage", "miss", "critical", "blessing", "curse"].includes(
          primaryAspect.type,
        ) ? (
          <AttackModifierCardLayer layer={aspectToLayer(primaryAspect)} />
        ) : (
          <div
            style={{
              zIndex: 3,

              gridColumn: "2",
              gridRow: "2",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              height: "100%",
              width: "100%",
            }}
          >
            <Aspect aspect={primaryAspect} />
          </div>
        )}
        {rolling && (
          <div
            style={{
              zIndex: 3,
              display: "flex",
              justifyContent: "center",

              gridColumn: "1",
              gridRow: "2",

              padding: "15%",
            }}
          >
            <DiamondIcon type="rolling" />
          </div>
        )}
        {secondaryAspect !== null && (
          <div
            style={{
              zIndex: 3,
              display: "flex",
              justifyContent: "center",

              gridColumn: "3",
              gridRow: "2",

              padding: "15%",
            }}
          >
            <Aspect aspect={secondaryAspect} />
          </div>
        )}
        {shuffle && (
          <div
            style={{
              zIndex: 3,
              display: "flex",
              justifyContent: "center",

              gridColumn: "3",
              gridRow: "3",

              padding: "10%",
            }}
          >
            <ShuffleIcon />
          </div>
        )}
      </div>
    </AspectRatio>
  )
}
