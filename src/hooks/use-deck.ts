import * as React from "react"
import sample from "lodash.sample"

import {
  DeckModifications,
  AttackModifierCardType,
  Character,
  AttackModifierCard,
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

function deckFromMap(
  map: Map<AttackModifierCardType, number>,
): Array<{ cardType: AttackModifierCardType; card: AttackModifierCard }> {
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

  const [nBlessings, internalSetNBlessings] = React.useState(0)
  const [nCurses, internalSetNCurses] = React.useState(0)
  const setNCurses = React.useCallback(
    (val: number) => internalSetNCurses(Math.max(0, val)),
    [],
  )
  const setNBlessings = React.useCallback(
    (val: number) => internalSetNBlessings(Math.max(0, val)),
    [],
  )

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

    // handle blessings/curses

    if (nBlessings > 0) {
      deckModifications.push({
        add: [{ cardType: "blessing/-/discard", count: nBlessings }],
      })
    }

    if (nCurses > 0) {
      deckModifications.push({
        add: [{ cardType: "curse/-/discard", count: nCurses }],
      })
    }

    // handle perks

    const klass = classId !== null ? classesById[classId] : null

    if (klass !== null) {
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
    }

    drawnCards.forEach(({ cardType }) => {
      // blessings/curses are completely removed from the deck after they're drawn
      // we leave them in the drawnCards pile so that the user can see them
      // but it's not necessary to remove them here because they've already been removed from the makeDeck calculation
      // removing them here would result in 2 blessings/curses being removed for every 1 that's drawn
      if (cardType === "blessing/-/discard" || cardType === "curse/-/discard") {
        return
      }

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
  }, [drawnCards, classId, encumbrance, perkChecks, nBlessings, nCurses])

  const draw = React.useCallback(() => {
    // this type looks funny but it works like Flow's $ElementType<array, number>
    const drawnCard: typeof deck[number] = sample(deck)

    if (drawnCard.cardType === "blessing/-/discard") {
      setNBlessings(nBlessings - 1)
    } else if (drawnCard.cardType === "curse/-/discard") {
      setNCurses(nCurses - 1)
    }

    setDrawnCards(prevDrawnCards => [drawnCard, ...prevDrawnCards])
  }, [deck, nBlessings, nCurses, setNCurses, setNBlessings])

  const shuffle = React.useCallback(() => {
    setDrawnCards([])
  }, [])

  return {
    deck,
    drawnCards,
    draw,
    shuffle,
    setNCurses: (val: number) => setNCurses(Math.max(0, val)),
    setNBlessings: (val: number) => setNBlessings(Math.max(0, val)),
    nBlessings,
    nCurses,
  }
}
