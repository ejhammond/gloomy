import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Redirect, RouteComponentProps, Link, Router } from "@reach/router"
import Img from "gatsby-image"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import Icon from "@material-ui/core/Icon"
import MenuIcon from "@material-ui/icons/Menu"

import { Index } from "./index"
import { Deck } from "./deck"
import { Perks } from "./perks"
import { ClassIcon } from "../../../../components/icons/class-icon"
import { useCharacter } from "./state"
import { Loading } from "../../../../providers/loading"

const bottomNavHeight = 56

const characterRouteContext = React.createContext<
  | undefined
  | {
      character: ReturnType<typeof useCharacter>["character"]
      dispatchCharacterAction: ReturnType<
        typeof useCharacter
      >["dispatchCharacterAction"]
    }
>(undefined)
const CharacterRouteContextProvider = characterRouteContext.Provider
export function useCharacterRouteContext() {
  const context = React.useContext(characterRouteContext)

  if (context === undefined) {
    throw new Error("Missing CharacterRouteContextProvider")
  }

  return context
}

export const Character: React.FC<RouteComponentProps<{
  characterId?: string
}>> = function Character({ characterId }) {
  const data = useStaticQuery(graphql`
    query {
      check: file(relativePath: { eq: "general/check.png" }) {
        childImageSharp {
          fluid(maxWidth: 32) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      cardBack: file(relativePath: { eq: "card-layers/back.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 32) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  const { character, dispatchCharacterAction, status, error } = useCharacter(
    characterId
  )

  // character will be undefined if it existed in the query cache during a given session
  // but then we deleted it from our query cache
  // note that the result is different if the character never existed in the query cache
  if (status === "success" && character === undefined) {
    return <Redirect to=".." noThrow />
  }

  if (status === "loading") {
    return <Loading />
  }

  if (status === "error") {
    return (
      <div>
        <p>Error retrieving character info</p>
        <p>{error.message}</p>
        <Link to="..">Back to Characters List</Link>
      </div>
    )
  }

  return (
    <>
      <div style={{ paddingBottom: bottomNavHeight + 32 }}>
        <CharacterRouteContextProvider
          value={{ character, dispatchCharacterAction }}
        >
          <Router>
            <Index path="/" />
            <Deck path="/deck" />
            <Perks path="/perks" />
          </Router>
        </CharacterRouteContextProvider>
      </div>
      <div
        style={{
          zIndex: 4,

          position: "fixed",
          width: "100%",
          maxWidth: 960,
          bottom: 0,
        }}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            component={Link}
            icon={
              character.classId !== null ? (
                <Icon>
                  <ClassIcon classId={character.classId} />
                </Icon>
              ) : (
                <div>?</div>
              )
            }
            to="."
            label="Character"
            value="character-info"
          />
          <BottomNavigationAction
            component={Link}
            icon={
              <Icon>
                <div
                  style={{
                    height: "inherit",
                    width: "inherit",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Img
                    style={{ width: "inherit" }}
                    fluid={data.cardBack.childImageSharp.fluid}
                  />
                </div>
              </Icon>
            }
            to="deck"
            label="Deck"
            value="deck"
          />
          <BottomNavigationAction
            component={Link}
            icon={
              <Icon>
                <div
                  style={{
                    height: "inherit",
                    width: "inherit",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Img
                    style={{ width: "inherit" }}
                    fluid={data.check.childImageSharp.fluid}
                  />
                </div>
              </Icon>
            }
            to="perks"
            label="Perks"
            value="perks"
          />
          <BottomNavigationAction
            component={Link}
            icon={<MenuIcon />}
            to="status"
            label="Status"
            value="status"
          />
        </BottomNavigation>
      </div>
    </>
  )
}
