import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { useNavigate } from '@reach/router';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import BackArrowIcon from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UnlockIcon from '@material-ui/icons/LockOpen';
import PeopleIcon from '@material-ui/icons/People';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import firebase from 'gatsby-plugin-firebase';

import { useLoading, Loading } from '../providers/loading';

import './reset.css';
import './disable-double-tap-zoom.css';
import '../fonts/fonts.css';

export function Layout({ children, pageTitle, lockedHeight = false }) {
  const loading = useLoading();
  const navigate = useNavigate();

  // for "lockedHeight" we need the viewport to be exactly 100vh
  // but mobile browser address-bars slide in and out without causing a reflow
  // so we need to keep track of the "real" height of the viewport via JS
  const [viewportHeight, setViewportHeight] = React.useState<number | undefined>(undefined);
  React.useLayoutEffect(() => {
    const handler = () => {
      setViewportHeight(window.innerHeight);
    };

    // set initial value
    handler();

    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);

    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const appBarRef = React.useRef<HTMLDivElement | undefined>(undefined);
  const [appBarHeight, setAppBarHeight] = React.useState<number>(56);
  React.useLayoutEffect(() => {
    const handler = () => {
      setAppBarHeight(appBarRef.current.clientHeight);
    };

    // set initial value
    handler();

    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);

    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);

  return (
    <>
      <AppBar position="fixed" ref={appBarRef}>
        <Toolbar>
          <IconButton color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <BackArrowIcon />
          </IconButton>
          <Typography variant="h5" style={{ fontFamily: 'Pirata One', margin: '0 auto' }}>
            <Link to="/app" style={{ color: 'inherit', textDecoration: 'none' }}>
              {pageTitle}
            </Link>
          </Typography>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        {loading && (
          <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <LinearProgress color="secondary" />
          </div>
        )}
      </AppBar>
      {lockedHeight && viewportHeight === undefined ? (
        <Loading />
      ) : (
        <main
          style={{
            ...(lockedHeight && {
              position: 'relative',
              height: viewportHeight,
              overflowY: 'hidden',
            }),
            margin: `0 auto`,
            maxWidth: 960,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: appBarHeight + 32,
          }}
        >
          {children}
        </main>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          style: {
            top: 'unset',
            bottom: 0,
            height: `calc(100% - ${appBarHeight}px)`,
          },
        }}
      >
        <List>
          <ListItem
            component={Link}
            to="/app/characters"
            onClick={() => setDrawerOpen(false)}
            style={{ color: 'inherit' }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Characters" />
          </ListItem>
          <ListItem
            component={Link}
            to="/app/unlocks"
            onClick={() => setDrawerOpen(false)}
            style={{ color: 'inherit' }}
          >
            <ListItemIcon>
              <UnlockIcon />
            </ListItemIcon>
            <ListItemText primary="Unlocks" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              firebase.auth().signOut();
              setDrawerOpen(false);
            }}
            style={{ color: 'inherit' }}
          >
            <ListItemIcon>
              <SignOutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
