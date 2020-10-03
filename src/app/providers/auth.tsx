import * as React from 'react';

import firebase from 'gatsby-plugin-firebase';
import { Loading } from '../../providers/loading';

const userContext = React.createContext<{ user: { id: string } } | undefined | null>(undefined);

const UserContextProvider = userContext.Provider;

export function UserProvider({ children }) {
  const [user, setUser] = React.useState<{ id: string } | undefined>(() => {
    const { currentUser } = firebase.auth();
    return currentUser !== null ? { id: currentUser.uid } : undefined;
  });

  React.useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        setUser({ id: user.uid });
      } else {
        setUser(null);
      }
    });

    return unregisterAuthObserver;
  }, []);

  return (
    <UserContextProvider value={{ user }}>
      {user === undefined && <Loading />}
      {children}
    </UserContextProvider>
  );
}

export function useAuthState() {
  const context = React.useContext(userContext);

  if (context === undefined) {
    throw new Error('Missing UserProvider');
  }

  const { user } = context;

  if (user === undefined) {
    return { status: 'authenticating' };
  }

  if (user === null) {
    return { status: 'signed-out' };
  }

  return { status: 'signed-in', user };
}

export function useUser() {
  const authState = useAuthState();

  if (authState.status !== 'signed-in') {
    throw new Error('Unable to useUser. User is not signed in');
  }

  return authState.user;
}
