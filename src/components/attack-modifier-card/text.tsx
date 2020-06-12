import {
  AttackModifierCard as AttackModifierCardType,
  InfuseAspect,
  StatusAspect,
  NumericalAspect,
} from "../../types"
import { statusNameById } from "../../configs/statuses"

function aspectToString(
  aspect:
    | AttackModifierCardType["primaryAspect"]
    | AttackModifierCardType["secondaryAspect"]
) {
  const { type } = aspect

  if (type === "damage") {
    const damageAspect = aspect as NumericalAspect
    return damageAspect.value >= 0
      ? `plus ${damageAspect.value}`
      : `minus ${-1 * damageAspect.value}`
  }

  if (type === "infuse") {
    const infuseAspect = aspect as InfuseAspect
    return `infuse ${infuseAspect.value}`
  }

  if (["push", "pull", "pierce", "heal", "shield"].includes(type)) {
    const numericalAspect = aspect as NumericalAspect
    return `${numericalAspect.type} ${numericalAspect.value}`
  }

  if (type === "miss") {
    return "miss"
  }

  if (type === "critical") {
    return "critical"
  }

  if (type === "add-target") {
    return "add a target"
  }

  if (type === "refresh-item") {
    return "refresh an item"
  }

  if (type === "add-blessing") {
    return "add a blessing"
  }

  if (type === "add-curse") {
    return "add a curse"
  }

  if (type === "status") {
    const effectAspect = aspect as StatusAspect
    return statusNameById[effectAspect.value]
  }

  throw new Error("Missing aspect type " + type)
}

export function attackModifierCardToString(card: AttackModifierCardType) {
  const { rolling, primaryAspect, secondaryAspect } = card

  const parts = []

  if (rolling) {
    parts.push("rolling")
  }

  parts.push(aspectToString(primaryAspect))

  if (secondaryAspect !== null) {
    parts.push(aspectToString(secondaryAspect))
  }

  return parts.join(" ")
}
