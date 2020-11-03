import { SnackbarOrigin } from '@material-ui/core/Snackbar';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import firebase from 'firebase/app';
import { SnackbarProvider as MaterialSnackbarProvider } from 'material-ui-snackbar-redux';
import { SnackbarProvider as NotistackSnackbarProver } from 'notistack';
import React, { useMemo, memo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
// eslint-disable-next-line
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RouterAndDataLoader from './RouterAndDataLoader';
import { initializeI18n, useDebouncedWindowSize } from './services';
import store from './store';
import { Theme } from './Theme';

initializeI18n();

const reduxFirebaseProps = {
  firebase,
  config: {
    userProfile: 'profiles',
    useFirestoreForProfile: true,
  },
  dispatch: store?.dispatch,
  createFirestoreInstance,
};

const snachbarPosition: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

export function App(props: {
  isStorybookEnv?: boolean;
  children?: JSX.Element;
}) {
  const theme = useMemo(() => createMuiTheme(), []);
  const isMobile =
    // @ts-ignore
    useDebouncedWindowSize(500).width < theme.breakpoints.values.sm;

  return (
    <div className="App">
      <ReduxProvider store={store}>
        <Theme isMobile={isMobile}>
          <MaterialSnackbarProvider
            SnackbarProps={{
              autoHideDuration: 4000,
              anchorOrigin: snachbarPosition,
            }}
          >
            <NotistackSnackbarProver
              dense={isMobile}
              autoHideDuration={3500}
              anchorOrigin={snachbarPosition}
            >
              {props.isStorybookEnv ? (
                <BrowserRouter>{props.children}</BrowserRouter>
              ) : (
                <ReactReduxFirebaseProvider {...reduxFirebaseProps}>
                  <RouterAndDataLoader>
                    {props.children}
                  </RouterAndDataLoader>
                </ReactReduxFirebaseProvider>
              )}
            </NotistackSnackbarProver>
          </MaterialSnackbarProvider>
        </Theme>
      </ReduxProvider>
    </div>
  );
}

export default memo(App);
