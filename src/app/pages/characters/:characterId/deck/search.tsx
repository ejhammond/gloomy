import * as React from 'react';
import { RouteComponentProps, Link as ReachLink } from '@reach/router';
import { Link as MUILink } from '@material-ui/core';
import BackArrowIcon from '@material-ui/icons/ArrowBack';

import { useCharacterRouteContext } from '../routes';
import { GridContainer, GridItem } from '../../../../../components/grid';
import { AttackModifierCard } from '../../../../../components/attack-modifier-card';
import { Heading } from '../../../../../components/heading';

export const DeckSearch: React.FC<RouteComponentProps> = () => {
  const { deck } = useCharacterRouteContext();

  return (
    <GridContainer>
      <GridItem span={4}>
        <Heading component="h2">Remaining Cards</Heading>
      </GridItem>
      {deck.map(({ cardType, card }, i) => (
        <GridItem key={`${cardType}-${i}`} span={2}>
          <div style={{ width: '90%', maxWidth: 400 }}>
            <AttackModifierCard variant="full" card={card} />
          </div>
        </GridItem>
      ))}
    </GridContainer>
  );
};
