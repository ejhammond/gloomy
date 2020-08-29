import * as React from "react"
import sample from "lodash.sample"

import {
  PerkChecks,
  DeckModifications,
  AttackModifierCardType,
  Character,
} from "../types"
import { classesById } from "../configs/classes"
import { perks } from "../configs/perks"
import { parse } from "../configs/cards"

const baseDeckModifications: DeckModifications = {
  add: [
    {
      cardType: "miss/-/shuffle",
      count: 1,
    },
    {
      cardType: "damage(-2)/-",
      count: 1,
    },
    {
      cardType: "damage(-1)/-",
      count: 5,
    },
    {
      cardType: "damage(0)/-",
      count: 6,
    },
    {
      cardType: "damage(1)/-",
      count: 5,
    },
    {
      cardType: "damage(2)/-",
      count: 1,
    },
    {
      cardType: "critical/-/shuffle",
      count: 1,
    },
  ],
}

function deckFromMap(map: Map<AttackModifierCardType, number>) {
  return Array.from(map.entries()).reduce((d, [cardType, count]) => {
    if (count > 0) {
      const card = parse(cardType)
      Array.from({ length: count }).forEach(() => {
        d.push({
          cardType,
          card,
        })
      })
    }

    return d
  }, [])
}

function makeDeck(deckModifications: DeckModifications[]) {
  const cardMap = deckModifications.reduce((deck, mod) => {
    const { add, remove } = mod

    if (Array.isArray(add)) {
      add.forEach(({ cardType, count }) => {
        if (!deck.has(cardType)) {
          deck.set(cardType, 0)
        }

        deck.set(cardType, deck.get(cardType) + count)
      })
    }

    if (Array.isArray(remove)) {
      remove.forEach(({ cardType, count }) => {
        if (!deck.has(cardType)) {
          deck.set(cardType, 0)
        }

        deck.set(cardType, deck.get(cardType) - count)
      })
    }

    return deck
  }, new Map())

  return deckFromMap(cardMap)
}

export function useDeck(character: Character) {
  const {
    classId,
    perkChecks,
    items: { encumbrance },
  } = character

  const [drawnCards, setDrawnCards] = React.useState([])

  const deck = React.useMemo(() => {
    const deckModifications: DeckModifications[] = [baseDeckModifications]

    // handle "encumbrance" (adds/removes -1 cards based on equipment)

    if (encumbrance > 0) {
      deckModifications.push({
        add: [
          {
            cardType: "damage(-1)/-",
            count: encumbrance,
          },
        ],
      })
    } else if (encumbrance < 0) {
      deckModifications.push({
        remove: [
          {
            cardType: "damage(-1)/-",
            count: Math.abs(encumbrance),
          },
        ],
      })
    }

    // handle perks

    const klass = classId !== null ? classesById[classId] : null

    const klassPerks = klass.perks.map(p => ({
      ...p,
      ...perks[p.id],
      checks: perkChecks[p.id],
    }))

    klassPerks.forEach(p => {
      if (p.checks > 0) {
        Array.from({ length: p.checks }).forEach(() => {
          deckModifications.push(p.deckModifications)
        })
      }
    })

    drawnCards.forEach(({ cardType }) => {
      deckModifications.push({
        remove: [
          {
            cardType,
            count: 1,
          },
        ],
      })
    })

    return makeDeck(deckModifications)
  }, [drawnCards, classId, encumbrance, perkChecks])

  const draw = React.useCallback(() => {
    const drawnCard = sample(deck)

    setDrawnCards(prevDrawnCards => [drawnCard, ...prevDrawnCards])
  }, [deck])

  const shuffle = React.useCallback(() => {
    setDrawnCards([])
  }, [])

  return { deck, drawnCards, draw, shuffle }
}
