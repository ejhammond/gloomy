import * as React from 'react';

import shieldIconURL from '../../images/general/shield.png';

export function ShieldIcon() {
  return (
    <div
      style={{
        width: 'inherit',
        height: 'inherit',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={shieldIconURL} alt="Shield" />
    </div>
  );
}
