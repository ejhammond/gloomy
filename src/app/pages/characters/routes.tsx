import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';

import { Character } from './:characterId/routes';
import { Index } from './index';
import { useCharactersList } from './state';
import { Loading } from '../../../providers/loading';
import { LoadingScreen } from '../../../components/loading-screen';

const charactersRouteContext = React.createContext<
  | undefined
  | Pick<ReturnType<typeof useCharactersList>, 'charactersList' | 'dispatchCharactersListAction'>
>(undefined);
const CharactersRouteContextProvider = charactersRouteContext.Provider;
export function useCharactersRouteContext() {
  const context = React.useContext(charactersRouteContext);

  if (context === undefined) {
    throw new Error('Missing CharactersRouteContextProvider');
  }

  return context;
}

export const Characters: React.FC<RouteComponentProps> = function Characters() {
  const { charactersList, dispatchCharactersListAction, statuses, errors } = useCharactersList();

  if (statuses.query === 'loading') {
    return <Loading />;
  }

  if (statuses.query === 'error') {
    return (
      <div>
        <p>Error loading characters</p>
        <p>{errors.query.message}</p>
      </div>
    );
  }

  if (statuses.add === 'loading') {
    return <LoadingScreen message="Creating character..." />;
  }

  return (
    <CharactersRouteContextProvider
      value={{
        charactersList,
        dispatchCharactersListAction,
      }}
    >
      <Router>
        <Index path="/" />
        <Character path=":characterId/*" />
      </Router>
    </CharactersRouteContextProvider>
  );
};
