import * as React from 'react';
import { Router } from '@reach/router';

import { AppIndex } from './index';
import { Characters } from './characters/routes';
import { Unlocks } from './unlocks';
import { Loading } from '../../providers/loading';
import { useUserSettings } from './state';

const appRouteContext = React.createContext<
  | undefined
  | {
      userSettings: ReturnType<typeof useUserSettings>['userSettings'];
      dispatchUserSettingsAction: ReturnType<typeof useUserSettings>['dispatchUserSettingsAction'];
    }
>(undefined);
const AppRouteContextProvider = appRouteContext.Provider;
export function useAppRouteContext() {
  const context = React.useContext(appRouteContext);

  if (context === undefined) {
    throw new Error('Missing AppRouteContextProvider');
  }

  return context;
}

export function App() {
  const { userSettings, dispatchUserSettingsAction, status, error } = useUserSettings();

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <div>Error loading settings {error.message}</div>;
  }

  return (
    <AppRouteContextProvider value={{ userSettings, dispatchUserSettingsAction }}>
      <Router basepath="/app">
        <AppIndex path="/" />
        <Unlocks path="/unlocks" />
        <Characters path="characters/*" />
      </Router>
    </AppRouteContextProvider>
  );
}
