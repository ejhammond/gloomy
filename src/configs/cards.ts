import {
  AttackModifierCard,
  AttackModifierCardType,
  AttackModifierCardAspect,
  Status,
} from "../types"

const numericalAspects = new Set([
  "damage",
  "push",
  "pull",
  "pierce",
  "heal",
  "shield",
])

function parseAspectType(aspectType: string): AttackModifierCardAspect {
  if (aspectType.indexOf("(") !== -1) {
    const match = /^(.+)\((.+)\)$/.exec(aspectType)
    if (match === null) {
      throw new Error("Cannot parse arg from aspectType " + aspectType)
    }

    const type = match[1] as AttackModifierCardAspect["type"]
    const value = match[2] as AttackModifierCardAspect["value"]

    if (numericalAspects.has(type)) {
      return {
        type,
        // @ts-ignore - assume that we parsed correctly
        value: parseInt(value, 10),
      }
    } else {
      // @ts-ignore - assume that we parsed correctly
      return { type, value }
    }
  } else {
    // @ts-ignore - assume that we parsed correctly
    return { type: aspectType }
  }
}

export function parse(cardType: AttackModifierCardType): AttackModifierCard {
  const [primaryAspectType, secondaryAspectType, ...flags] = cardType.split("/")

  return {
    primaryAspect: parseAspectType(primaryAspectType),
    secondaryAspect:
      secondaryAspectType !== "-" ? parseAspectType(secondaryAspectType) : null,
    rolling: flags.includes("rolling"),
    shuffle: flags.includes("shuffle"),
    discard: flags.includes("discard"),
  }
}

// export function stringify(card: AttackModifierCard) {
//   const { primaryAspect, secondaryAspect, rolling, shuffle, discard } = card

//   return [
//     `${primaryAspect.type}${
//       primaryAspect.value !== undefined ? `(${primaryAspect.value})` : ""
//     }`,
//     secondaryAspect !== null
//       ? `${secondaryAspect.type}${
//           secondaryAspect.value !== undefined
//             ? `(${secondaryAspect.value})`
//             : ""
//         }`
//       : "-",
//     rolling ? "rolling" : undefined,
//     shuffle ? "shuffle" : undefined,
//     discard ? "discard" : undefined,
//   ]
//     .filter(Boolean) // remove undefined
//     .join("/")
// }
