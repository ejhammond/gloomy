import * as React from "react"
import sample from "lodash.sample"
import { graphql, useStaticQuery } from "gatsby"
import { useTransition, animated, useSpring } from "react-spring"
import Img from "gatsby-image"
import { RouteComponentProps } from "@reach/router"
import FloatingActionButton from "@material-ui/core/Fab"

import { GridContainer, GridItem } from "../../../../components/grid"
import { DeckModifications, AttackModifierCardType } from "../../../../types"
import { useCharacterRouteContext } from "./routes"
import { classesById } from "../../../../configs/classes"
import { perks } from "../../../../configs/perks"
import { AttackModifierCard } from "../../../../components/attack-modifier-card"
import { parse } from "../../../../configs/cards"
import Typography from "@material-ui/core/Typography"

const AnimatedGridItem = animated(GridItem)

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

export function Deck(props: RouteComponentProps) {
  const data = useStaticQuery(graphql`
    query {
      drawCard: file(relativePath: { eq: "general/draw-card.png" }) {
        childImageSharp {
          fluid(maxWidth: 56) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      shuffle: file(relativePath: { eq: "general/shuffle.png" }) {
        childImageSharp {
          fluid(maxWidth: 56) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  const { character } = useCharacterRouteContext()

  const [drawnCards, setDrawnCards] = React.useState([])

  const drawnCardTransitions = useTransition(
    drawnCards.map((dc, index) => ({
      ...dc,
      key: drawnCards.length - index,
      index,
    })),
    dc => dc.key,
    {
      from: { transform: "translate3d(0px,-100%,0px)", opacity: 0 },
      enter: ({ index }) => ({
        transform: `translate3d(0px,${index * 100}%,0px)`,
        opacity: 1,
      }),
      update: ({ index }) => ({
        transform: `translate3d(0px,${index * 100}%,0px)`,
        opacity: 1,
      }),
      leave: { transform: "translate3d(0px,0px,0px)", opacity: 0 },
    },
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

  const deck = makeDeck(deckModifications)

  return (
    <GridContainer>
      <GridItem
        span={3}
        style={{
          position: "relative",
        }}
      >
        {drawnCardTransitions.map(({ item, props, key }, i) => (
          <animated.div
            key={key}
            style={{
              position: "absolute",
              width: "100%",
              paddingBottom: 16,
              ...props,
            }}
          >
            <div style={{ width: "90%", maxWidth: 400 }}>
              <AttackModifierCard variant="full" card={item.card} />
            </div>
          </animated.div>
        ))}
      </GridItem>
      <FloatingActionButton
        size="small"
        color="primary"
        style={{
          zIndex: 10,
          position: "fixed",
          bottom: 140,
          right: 40,
        }}
        disabled={drawnCards.length === 0}
        onClick={() => {
          setDrawnCards([])
        }}
      >
        <Img
          style={{ width: "65%" }}
          fluid={data.shuffle.childImageSharp.fluid}
        />
      </FloatingActionButton>
      <FloatingActionButton
        color="primary"
        style={{
          zIndex: 10,
          position: "fixed",
          bottom: 80,
          right: 40,
        }}
        disabled={deck.length === 0}
        onClick={() => {
          const drawnCard = sample(deck)

          setDrawnCards([drawnCard, ...drawnCards])
        }}
      >
        <Img
          style={{ width: "65%" }}
          fluid={data.drawCard.childImageSharp.fluid}
        />
      </FloatingActionButton>
    </GridContainer>
  )
}
