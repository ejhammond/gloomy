import * as React from 'react';
import { DiamondIcon } from './diamond-icon';
import { Typography } from '@material-ui/core';

export function PushIcon({ value }: { value: number }) {
  return (
    <div
      style={{
        width: 'inherit',
        height: 'inherit',

        position: 'relative',
      }}
    >
      <DiamondIcon type="push" />
      <Typography
        style={{
          color: 'white',
          position: 'absolute',
          bottom: 2,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {value}
      </Typography>
    </div>
  );
}
