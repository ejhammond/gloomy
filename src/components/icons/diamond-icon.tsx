import * as React from "react"

import addTargetIconURL from "../../images/effects/add-target.png"
import blessIconURL from "../../images/effects/bless.png"
import curseIconURL from "../../images/effects/curse.png"
import disarmIconURL from "../../images/effects/disarm.png"
import immobilizeIconURL from "../../images/effects/immobilize.png"
import invisibleIconURL from "../../images/effects/invisible.png"
import muddleIconURL from "../../images/effects/muddle.png"
import pierceIconURL from "../../images/effects/pierce.png"
import poisonIconURL from "../../images/effects/poison.png"
import pullIconURL from "../../images/effects/pull.png"
import pushIconURL from "../../images/effects/push.png"
import rollingIconURL from "../../images/general/rolling.png"
import strengthenIconURL from "../../images/effects/strengthen.png"
import stunIconURL from "../../images/effects/stun.png"
import woundIconURL from "../../images/effects/wound.png"

export type DiamondIconType =
  | "add-target"
  | "add-bless"
  | "add-curse"
  | "disarm"
  | "immobilize"
  | "invisible"
  | "muddle"
  | "pierce"
  | "poison"
  | "pull"
  | "push"
  | "rolling"
  | "strengthen"
  | "stun"
  | "wound"

const iconURLs: Record<DiamondIconType, string> = {
  "add-target": addTargetIconURL,
  "add-bless": blessIconURL,
  "add-curse": curseIconURL,
  disarm: disarmIconURL,
  immobilize: immobilizeIconURL,
  invisible: invisibleIconURL,
  muddle: muddleIconURL,
  pierce: pierceIconURL,
  poison: poisonIconURL,
  pull: pullIconURL,
  push: pushIconURL,
  rolling: rollingIconURL,
  strengthen: strengthenIconURL,
  stun: stunIconURL,
  wound: woundIconURL,
}

const iconNames: Record<DiamondIconType, string> = {
  "add-target": "Add target",
  "add-bless": "Add blessing",
  "add-curse": "Add curse",
  disarm: "Disarm",
  immobilize: "Immobilize",
  invisible: "Invisible",
  muddle: "Muddle",
  pierce: "Pierce",
  poison: "Poison",
  pull: "Pull",
  push: "Push",
  rolling: "Rolling",
  strengthen: "Strengthen",
  stun: "Stun",
  wound: "Wound",
}

export function DiamondIcon({ type }: { type: DiamondIconType }) {
  return (
    <div
      aria-hidden
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
        src={iconURLs[type]}
        alt={iconNames[type]}
      />
    </div>
  )
}
