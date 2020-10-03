import * as React from 'react';
import { DiamondIcon } from './diamond-icon';
import { Typography } from '@material-ui/core';

export function PierceIcon({ value }: { value: number }) {
  return (
    <div
      style={{
        width: 'inherit',
        height: 'inherit',

        position: 'relative',
      }}
    >
      <DiamondIcon type="pierce" />
      <Typography
        style={{
          color: 'white',
          position: 'absolute',
          bottom: 12,
          left: '42%',
          transform: 'translateX(-50%)',
        }}
      >
        {value}
      </Typography>
    </div>
  );
}
