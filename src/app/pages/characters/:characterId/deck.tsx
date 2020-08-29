import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { useTransition, animated } from "react-spring"
import Img from "gatsby-image"
import { RouteComponentProps } from "@reach/router"
import FloatingActionButton from "@material-ui/core/Fab"

import { GridContainer, GridItem } from "../../../../components/grid"
import { useCharacterRouteContext } from "./routes"
import { AttackModifierCard } from "../../../../components/attack-modifier-card"

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

  const { drawnCards, deck, draw, shuffle } = useCharacterRouteContext()

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
        onClick={shuffle}
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
        onClick={draw}
      >
        <Img
          style={{ width: "65%" }}
          fluid={data.drawCard.childImageSharp.fluid}
        />
      </FloatingActionButton>
    </GridContainer>
  )
}
