import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { RouteComponentProps, Link } from '@reach/router';
import { useTransition, animated } from 'react-spring';
import Img from 'gatsby-image';
import FloatingActionButton from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Popover from '@material-ui/core/Popover';
import SearchIcon from '@material-ui/icons/Search';

import { GridContainer, GridItem } from '../../../../../components/grid';
import { useCharacterRouteContext } from '../routes';
import { AttackModifierCard } from '../../../../../components/attack-modifier-card';
import { Counter } from '../../../../../components/counter';
import { DiamondIcon } from '../../../../../components/icons/diamond-icon';

export const Deck: React.FC<RouteComponentProps> = () => {
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
  `);

  const [blessingsPopoverAnchor, setBlessingsPopoverAnchor] = React.useState(null);
  const [cursesPopoverAnchor, setCursesPopoverAnchor] = React.useState(null);

  const {
    drawnCards,
    deck,
    draw,
    shuffle,
    nBlessings,
    nCurses,
    setNCurses,
    setNBlessings,
  } = useCharacterRouteContext();

  const drawnCardTransitions = useTransition(
    drawnCards.map((dc, index) => ({
      ...dc,
      key: drawnCards.length - index,
      index,
    })),
    (dc) => dc.key,
    {
      from: { transform: 'translate3d(0px,-100%,0px)', opacity: 0 },
      enter: ({ index }) => ({
        transform: `translate3d(0px,${index * 100}%,0px)`,
        opacity: 1,
      }),
      update: ({ index }) => ({
        transform: `translate3d(0px,${index * 100}%,0px)`,
        opacity: 1,
      }),
      leave: { transform: 'translate3d(0px,0px,0px)', opacity: 0 },
    },
  );

  return (
    <GridContainer>
      <GridItem
        span={3}
        style={{
          position: 'relative',
        }}
      >
        {drawnCardTransitions.map(({ item, props, key }) => (
          <animated.div
            key={key}
            style={{
              position: 'absolute',
              width: '100%',
              paddingBottom: 16,
              ...props,
            }}
          >
            <div style={{ width: '90%', maxWidth: 400 }}>
              <AttackModifierCard variant="full" card={item.card} />
            </div>
          </animated.div>
        ))}
      </GridItem>
      <GridItem span={1}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <IconButton onClick={(e) => setBlessingsPopoverAnchor(e.currentTarget)}>
              <Badge badgeContent={nBlessings} color="secondary">
                <div style={{ height: 50, width: 50 }}>
                  <DiamondIcon type="add-bless" />
                </div>
              </Badge>
            </IconButton>
            <Popover
              open={Boolean(blessingsPopoverAnchor)}
              anchorEl={blessingsPopoverAnchor}
              onClose={() => setBlessingsPopoverAnchor(null)}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
            >
              <Counter value={nBlessings} onChange={setNBlessings} layout="vertical" hideInput />
            </Popover>
          </div>
          <div>
            <IconButton onClick={(e) => setCursesPopoverAnchor(e.currentTarget)}>
              <div style={{ height: 50, width: 50 }}>
                <Badge badgeContent={nCurses} color="secondary">
                  <DiamondIcon type="add-curse" />
                </Badge>
              </div>
            </IconButton>
            <Popover
              open={Boolean(cursesPopoverAnchor)}
              anchorEl={cursesPopoverAnchor}
              onClose={() => setCursesPopoverAnchor(null)}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
            >
              <Counter value={nCurses} onChange={setNCurses} layout="vertical" hideInput />
            </Popover>
          </div>
        </div>
      </GridItem>
      <FloatingActionButton
        component={Link}
        to="search"
        size="small"
        color="primary"
        style={{
          zIndex: 10,
          position: 'fixed',
          bottom: 200,
          right: 40,
        }}
        disabled={deck.length === 0}
      >
        <SearchIcon />
      </FloatingActionButton>
      <FloatingActionButton
        size="small"
        color="primary"
        style={{
          zIndex: 10,
          position: 'fixed',
          bottom: 150,
          right: 40,
        }}
        disabled={drawnCards.length === 0}
        onClick={shuffle}
      >
        <Img style={{ width: '65%' }} fluid={data.shuffle.childImageSharp.fluid} />
      </FloatingActionButton>
      <FloatingActionButton
        color="primary"
        style={{
          zIndex: 10,
          position: 'fixed',
          bottom: 80,
          right: 40,
        }}
        disabled={deck.length === 0}
        onClick={draw}
      >
        <Img style={{ width: '65%' }} fluid={data.drawCard.childImageSharp.fluid} />
      </FloatingActionButton>
    </GridContainer>
  );
};
