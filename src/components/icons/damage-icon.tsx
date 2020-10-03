import * as React from 'react';

export function DamageIcon({
  damage,
  style = {},
  ...otherProps
}: React.ComponentPropsWithoutRef<'div'> & {
  damage: number;
}) {
  return (
    <div
      style={{
        height: '1em',
        width: '1em',
        lineHeight: '1em',

        border: '1px solid black',
        borderRadius: '50%',
        ...style,
      }}
      {...otherProps}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          fontFamily: 'Pirata One',
          fontSize: '0.7em',
        }}
      >
        {damage >= 0 ? `+${damage}` : damage}
      </div>
    </div>
  );
}
