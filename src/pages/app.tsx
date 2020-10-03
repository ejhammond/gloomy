import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'gatsby-plugin-firebase';

import { App } from '../app/pages/routes';
import { Layout } from '../components/layout';
import { UserProvider, useAuthState } from '../app/providers/auth';
import SEO from '../components/seo';

function SSRGate({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (mounted === false) {
    return null;
  }

  return <>{children}</>;
}

function UserGate({ children }) {
  const { status } = useAuthState();

  const uiConfig = React.useMemo(() => {
    return {
      signInFlow: 'redirect',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };
  }, []);

  if (status === 'authenticating') {
    return <div>Authenticating...</div>;
  }

  if (status === 'signed-out') {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
  }

  return <>{children}</>;
}

export default function AppPage() {
  return (
    <Layout pageTitle="Gloomy">
      <SEO title="App" />
      <SSRGate>
        <UserProvider>
          <UserGate>
            <App />
          </UserGate>
        </UserProvider>
      </SSRGate>
    </Layout>
  );
}
