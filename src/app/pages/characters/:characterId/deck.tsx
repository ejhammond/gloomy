import * as React from "react"
import sample from "lodash.sample"

import { RouteComponentProps } from "@reach/router"
import { GridContainer, GridItem } from "../../../../components/grid"
import { DeckModifications, AttackModifierCardType } from "../../../../types"
import { useCharacterRouteContext } from "./routes"
import { classesById } from "../../../../configs/classes"
import { perks } from "../../../../configs/perks"
import { AttackModifierCard } from "../../../../components/attack-modifier-card"
import { parseCardType } from "../../../../configs/cards"

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
      const card = parseCardType(cardType)
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

export function Deck(props: RouteComponentProps) {
  const { character } = useCharacterRouteContext()

  const [drawnCards, setDrawnCards] = React.useState(
    new Map<AttackModifierCardType, number>(),
  )

  const klass =
    character.classId !== null ? classesById[character.classId] : null

  const klassPerks = klass.perks.map(p => ({
    ...p,
    ...perks[p.id],
    checks: character.perkChecks[p.id],
  }))

  const deckModifications = [baseDeckModifications]
  klassPerks.forEach(p => {
    if (p.checks > 0) {
      Array.from({ length: p.checks }).forEach(() => {
        deckModifications.push(p.deckModifications)
      })
    }
  })
  Array.from(drawnCards.entries()).forEach(([cardType, count]) => {
    deckModifications.push({
      remove: [
        {
          cardType,
          count,
        },
      ],
    })
  })

  const deck = makeDeck(deckModifications)

  return (
    <GridContainer>
      {deck.map(({ card, cardType }, i) => (
        <GridItem key={i} span={1}>
          <AttackModifierCard variant="full" card={card} />
        </GridItem>
      ))}
      <button
        onClick={() => {
          const drawnCard = sample(deck)

          const drawnCardsClone = new Map(Array.from(drawnCards))
          if (!drawnCardsClone.has(drawnCard.cardType)) {
            drawnCardsClone.set(drawnCard.cardType, 0)
          }
          drawnCardsClone.set(
            drawnCard.cardType,
            drawnCardsClone.get(drawnCard.cardType) + 1,
          )
          setDrawnCards(drawnCardsClone)
        }}
      >
        Draw
      </button>
      {deckFromMap(drawnCards).map(({ card }, i) => (
        <GridItem key={i} span={1}>
          <AttackModifierCard variant="full" card={card} />
        </GridItem>
      ))}
    </GridContainer>
  )
}
