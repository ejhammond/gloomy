import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Redirect, RouteComponentProps, Link, Router } from '@reach/router';
import Img from 'gatsby-image';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';

import { Index } from './index';
import { Deck } from './deck';
import { DeckSearch } from './deck/search';
import { Items } from './items';
import { useDeck } from '../../../../hooks/use-deck';
import { ClassIcon } from '../../../../components/icons/class-icon';
import { useCharacter } from './state';
import { Loading } from '../../../../providers/loading';

const bottomNavHeight = 56;

type CharacterRouteContextValue = {
  character: ReturnType<typeof useCharacter>['character'];
  dispatchCharacterAction: ReturnType<typeof useCharacter>['dispatchCharacterAction'];
} & ReturnType<typeof useDeck>;

const characterRouteContext = React.createContext<undefined | CharacterRouteContextValue>(
  undefined,
);

function CharacterRouteContextProvider(props: {
  value: {
    character: ReturnType<typeof useCharacter>['character'];
    dispatchCharacterAction: ReturnType<typeof useCharacter>['dispatchCharacterAction'];
  };
  children: React.ReactNode;
}) {
  const {
    children,
    value: { character, dispatchCharacterAction },
  } = props;

  const deckStuff = useDeck(character);

  return (
    <characterRouteContext.Provider value={{ character, dispatchCharacterAction, ...deckStuff }}>
      {children}
    </characterRouteContext.Provider>
  );
}

export function useCharacterRouteContext() {
  const context = React.useContext(characterRouteContext);

  if (context === undefined) {
    throw new Error('Missing CharacterRouteContextProvider');
  }

  return context;
}

export const Character: React.FC<RouteComponentProps<{
  characterId?: string;
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
  `);

  const { character, dispatchCharacterAction, status, error } = useCharacter(characterId);

  // character will be undefined if it existed in the query cache during a given session
  // but then we deleted it from our query cache
  // note that the result is different if the character never existed in the query cache
  if (status === 'success' && character === undefined) {
    return <Redirect to=".." noThrow />;
  }

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <div>
        <p>Error retrieving character info</p>
        <p>{error.message}</p>
        <Link to="/app/characters">Back to Characters List</Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ paddingBottom: bottomNavHeight + 32 }}>
        <CharacterRouteContextProvider value={{ character, dispatchCharacterAction }}>
          <Router>
            <Index path="/" />
            {/* we keep the deck stuff at this level so that it doesn't reset as the user switches screens */}
            <Deck path="/deck" />
            <DeckSearch path="/deck/search" />
            <Items path="/items" />
          </Router>
        </CharacterRouteContextProvider>
      </div>
      <div
        style={{
          zIndex: 4,

          marginLeft: '-16px',
          position: 'fixed',
          width: '100%',
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
                    height: 'inherit',
                    width: 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Img style={{ width: 'inherit' }} fluid={data.cardBack.childImageSharp.fluid} />
                </div>
              </Icon>
            }
            to="deck"
            label="Deck"
            value="deck"
          />
          <BottomNavigationAction
            component={Link}
            icon={<BusinessCenterIcon />}
            to="items"
            label="Items"
            value="items"
          />
          {/* <BottomNavigationAction
            component={Link}
            icon={<BarChartIcon />}
            to="status"
            label="Status"
            value="status"
          /> */}
        </BottomNavigation>
      </div>
    </>
  );
};
