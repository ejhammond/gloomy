import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import {
  AttackModifierCard as AttackModifierCardType,
  InfuseAspect,
  NumericalAspect,
  StatusAspect,
} from '../../types';
import { statusNameById } from '../../configs/statuses';
import { DiamondIcon } from '../icons/diamond-icon';
import { ElementIcon } from '../icons/element-icon';
import { HealIcon } from '../icons/heal-icon';
import { ShieldIcon } from '../icons/shield-icon';
import { DamageIcon } from '../icons/damage-icon';
import { attackModifierCardToString } from './text';
import { HStack } from '../h-stack';

const iconSpacing = '0.2em';

function InlineAspect({
  aspect,
}: {
  aspect: AttackModifierCardType['primaryAspect'] | AttackModifierCardType['secondaryAspect'];
}) {
  const { type } = aspect;

  if (type === 'damage') {
    const damageAspect = aspect as NumericalAspect;
    return (
      <Icon>
        <DamageIcon damage={damageAspect.value} />
      </Icon>
    );
  }

  if (type === 'infuse') {
    const infuseAspect = aspect as InfuseAspect;
    return (
      <Icon>
        <ElementIcon element={infuseAspect.value} />
      </Icon>
    );
  }

  if (type === 'heal') {
    const healAspect = aspect as NumericalAspect;
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'capitalize' }}>heal</span>
        <Icon>
          <HealIcon />
        </Icon>
        <Typography component="span">{healAspect.value}</Typography>
      </HStack>
    );
  }

  if (type === 'shield') {
    const shieldAspect = aspect as NumericalAspect;
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'capitalize' }}>shield</span>
        <Icon>
          <ShieldIcon />
        </Icon>
        <Typography component="span">{shieldAspect.value}</Typography>
      </HStack>
    );
  }

  if (type === 'add-target') {
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'uppercase' }}>{aspect.type}</span>
        <Icon>
          <DiamondIcon type="add-target" />
        </Icon>
      </HStack>
    );
  }

  if (['pull', 'push', 'pierce'].includes(type)) {
    const NumericalAspect = aspect as NumericalAspect;
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'uppercase' }}>{NumericalAspect.type}</span>
        <Icon>
          {/**
           // @ts-ignore type is guaranteed to be push/pull/pierce */}
          <DiamondIcon type={NumericalAspect.type} />
        </Icon>
        <Typography component="span">{NumericalAspect.value}</Typography>
      </HStack>
    );
  }

  if (type === 'refresh-item') {
    return <span>Refresh an item</span>;
  }

  if (type === 'miss') {
    return <span>Miss</span>;
  }

  if (type === 'critical') {
    return <span>Critical</span>;
  }

  if (type === 'add-blessing') {
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'uppercase' }}>{aspect.type}</span>
        <Icon>
          {/**
       // @ts-ignore type is guaranteed to be add-blessing */}
          <DiamondIcon type="add-blessing" />
        </Icon>
      </HStack>
    );
  }

  if (type === 'add-curse') {
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'uppercase' }}>{aspect.type}</span>
        <Icon>
          {/**
       // @ts-ignore type is guaranteed to be add-curse */}
          <DiamondIcon type="add-curse" />
        </Icon>
      </HStack>
    );
  }

  if (type === 'status') {
    const statusAspect = aspect as StatusAspect;
    return (
      <HStack spacing={iconSpacing}>
        <span style={{ textTransform: 'uppercase' }}>{statusNameById[statusAspect.value]}</span>
        <Icon>
          <DiamondIcon type={statusAspect.value} />
        </Icon>
      </HStack>
    );
  }

  throw new Error('Unrecognized aspect ' + type);
}

export function InlineAttackModifierCard({ card }: { card: AttackModifierCardType }) {
  const { primaryAspect, secondaryAspect, rolling = false } = card;

  const icons = [];

  if (rolling) {
    icons.push(
      <Icon key="rolling" aria-hidden>
        <DiamondIcon type="rolling" />
      </Icon>,
    );
  }

  icons.push(<InlineAspect key="primary" aspect={primaryAspect} aria-hidden />);

  if (secondaryAspect !== null) {
    icons.push(<InlineAspect key="secondary" aspect={secondaryAspect} aria-hidden />);
  }

  return (
    <HStack spacing={iconSpacing} aria-label={attackModifierCardToString(card)}>
      {icons}
    </HStack>
  );
}
