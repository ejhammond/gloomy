import * as React from 'react';
import {
  ThemeProvider as MUIThemeProvider,
  createMuiTheme,
  useTheme as useMUITheme,
} from '@material-ui/core';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#100b06',
    },
    secondary: {
      main: '#c7612f',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: ['"High Tower"', 'serif'].join(','),
  },
});

export function useTheme() {
  return useMUITheme<typeof muiTheme>();
}

export function ThemeProvider({ children }) {
  return <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>;
}
