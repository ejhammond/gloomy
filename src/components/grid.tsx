import * as React from 'react';
import Grid from '@material-ui/core/Grid';

export function GridContainer({ children, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {children}
    </Grid>
  );
}

type XSSpan = 3 | 6 | 9 | 12;

export function GridItem({ span, children, ...other }) {
  return (
    <Grid item xs={(span * 3) as XSSpan} {...other}>
      {children}
    </Grid>
  );
}
