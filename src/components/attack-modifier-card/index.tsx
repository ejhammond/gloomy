import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import { AttackModifierCard as AttackModifierCardType } from '../../types';
import { attackModifierCardToString } from './text';
import { InlineAttackModifierCard } from './inline';
import { FullAttackModifierCard } from './full';

export function AttackModifierCard({
  variant,
  card,
}: {
  variant: 'inline' | 'full' | 'text';
  card: AttackModifierCardType;
}) {
  switch (variant) {
    case 'inline':
      return <InlineAttackModifierCard card={card} />;
    case 'text':
      return <Typography>{attackModifierCardToString(card)}</Typography>;
    case 'full':
      return <FullAttackModifierCard card={card} />;
  }
}
