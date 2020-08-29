export type Element = "fire" | "ice" | "earth" | "light" | "dark" | "wind"

export type Status =
  | "disarm"
  | "immobilize"
  | "invisible"
  | "muddle"
  | "poison"
  | "strengthen"
  | "stun"
  | "wound"

// attack modifier card

export type AttackModifierCardType =
  // status
  | "status(disarm)/-/rolling"
  | "status(immobilize)/-/rolling"
  | "status(invisible)/-/rolling"
  | "status(muddle)/-/rolling"
  | "status(poison)/-/rolling"
  | "status(stun)/-/rolling"
  | "status(wound)/-/rolling"
  // add-target
  | "add-target/-/rolling"
  // add curse/blessing
  | "add-blessing/-/rolling"
  | "add-curse/-/rolling"
  // invisible
  | "invisible/-/rolling"
  // pierce
  | "pierce(3)/-/rolling"
  // push/pull
  | "pull(1)/-/rolling"
  | "push(1)/-/rolling"
  | "push(2)/-/rolling"
  // shield
  | "shield(1)/-/rolling"
  // heal
  | "heal(1)/-"
  | "heal(1)/-/rolling"
  | "heal(3)/-/rolling"
  // infuse
  | "infuse(dark)/-/rolling"
  | "infuse(fire)/-/rolling"
  | "infuse(earth)/-/rolling"
  | "infuse(light)/-/rolling"
  | "infuse(wind)/-/rolling"
  // minus 2
  | "damage(-2)/-"
  // minus 1
  | "damage(-1)/-"
  | "damage(-1)/infuse(dark)"
  // plus 0
  | "damage(0)/-"
  | "damage(0)/add-target"
  | "damage(0)/infuse(earth)"
  | "damage(0)/infuse(fire)"
  | "damage(0)/infuse(ice)"
  | "damage(0)/infuse(wind)"
  | "damage(0)/refresh-item"
  | "damage(0)/status(stun)"
  // plus 1
  | "damage(1)/-"
  | "damage(1)/-/rolling"
  | "damage(1)/add-curse"
  | "damage(1)/heal(2)"
  | "damage(1)/infuse(dark)"
  | "damage(1)/infuse(earth)"
  | "damage(1)/infuse(light)"
  | "damage(1)/infuse(wind)"
  | "damage(1)/invisible"
  | "damage(1)/push(1)"
  | "damage(1)/shield-1"
  | "damage(1)/status(disarm)"
  | "damage(1)/status(disarm)/rolling"
  | "damage(1)/status(immobilize)"
  | "damage(1)/status(invisible)"
  | "damage(1)/status(poison)"
  | "damage(1)/status(wound)"
  // plus 2
  | "damage(2)/-"
  | "damage(2)/-/rolling"
  | "damage(2)/add-curse"
  | "damage(2)/infuse(fire)"
  | "damage(2)/infuse(ice)"
  | "damage(2)/status(muddle)"
  | "damage(2)/status(poison)"
  | "damage(2)/status(wound)"
  // plus 3+
  | "damage(3)/-"
  | "damage(3)/status(muddle)"
  | "damage(4)/-"
  // critical/miss
  | "critical/-/shuffle"
  | "miss/-/shuffle"
  // blessing/curse
  | "blessing/-/discard"
  | "curse/-/discard"

export type SimpleAspect =
  | { type: "add-target" }
  | { type: "add-blessing" }
  | { type: "add-curse" }
  | { type: "critical" }
  | { type: "miss" }
  | { type: "blessing" }
  | { type: "curse" }
  | { type: "refresh-item" }
export type NumericalAspect =
  | { type: "damage"; value: number }
  | { type: "heal"; value: number }
  | { type: "shield"; value: number }
  | { type: "pull"; value: number }
  | { type: "push"; value: number }
  | { type: "pierce"; value: number }
export type StatusAspect = { type: "status"; value: Status }
export type InfuseAspect = { type: "infuse"; value: Element }

export type AttackModifierCardAspect =
  | SimpleAspect
  | NumericalAspect
  | InfuseAspect
  | StatusAspect

export type AttackModifierCard = {
  primaryAspect: AttackModifierCardAspect
  secondaryAspect: AttackModifierCardAspect | null
  rolling?: boolean
  shuffle?: boolean
  discard?: boolean
}

// perks

type DeckModification = {
  cardType: AttackModifierCardType
  count: number
}

export type DeckModifications = {
  add?: DeckModification[]
  remove?: DeckModification[]
}

export type PerkData = {
  deckModifications: DeckModifications
  nonDeckEffect?: string
}

export type Perk = {
  id: string
  stock: number
}

// classes

export type ClassId =
  | "beast-tyrant"
  | "berserker"
  | "bladeswarm"
  | "brute"
  | "cragheart"
  | "doomstalker"
  | "elementalist"
  | "mindthief"
  | "nightshroud"
  | "plagueherald"
  | "quartermaster"
  | "sawbones"
  | "scoundrel"
  | "soothsinger"
  | "spellweaver"
  | "summoner"
  | "sunkeeper"
  | "tinkerer"

export type ClassConfiguration = {
  id: ClassId
  name: string
  spoilerTreatment:
    | { type: "none" }
    | { type: "name-hidden"; safeName: string }
    | { type: "completely-hidden"; unlockKey: string }
  race:
    | "Aesther"
    | "Harrower"
    | "Human"
    | "Inox"
    | "Orchid"
    | "Quatryl"
    | "Savvas"
    | "Valrath"
    | "Vermling"
  hpTrack: "light" | "normal" | "heavy"
  perks: Perk[]
}

export type Character = {
  id: string
  name: string
  classId: ClassId | null
  xp: number
  gold: number
  notes: string
  battleGoalChecks: number
  perkChecks: { [perkId: string]: number }
  retired: boolean
  items: {
    head: string
    body: string
    hand1: string
    hand2: string
    feet: string
    bag: { [bagItemId: string]: string }
    storage: { [storageItemId: string]: string }
    encumbrance: number
  }
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
