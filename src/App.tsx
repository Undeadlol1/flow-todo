// import { useWindowSize } from '@reach/window-size';
import { createMuiTheme } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import { SnackbarProvider as MaterialSnackbarProvider } from 'material-ui-snackbar-redux';
import { SnackbarProvider as NotistackSnackbarProver } from 'notistack';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { useWindowSize } from 'react-use';
import { createFirestoreInstance } from 'redux-firestore';
import './App.css';
import Router from './Router';
import { initializeI18n } from './services';
import store from './store';
import { Theme } from './Theme';

initializeI18n();

function App() {
  const theme = React.useMemo(() => createMuiTheme(), []);
  const isMobile =
    useWindowSize().width < theme.breakpoints.values.sm;

  const reduxFirebaseProps = {
    firebase,
    config: {
      userProfile: 'profiles',
      useFirestoreForProfile: true,
    },
    dispatch: store.dispatch,
    createFirestoreInstance,
  };

  return (
    <div className="App">
      <ReduxProvider store={store}>
        <ReactReduxFirebaseProvider {...reduxFirebaseProps}>
          <Theme isMobile={isMobile}>
            {/* TODO do i even use this? Remove if not */}
            <MaterialSnackbarProvider
              SnackbarProps={{ autoHideDuration: 4000 }}
            >
              <NotistackSnackbarProver
                autoHideDuration={3500}
                dense={isMobile}
                anchorOrigin={
                  isMobile
                    ? {
                        vertical: 'top',
                        horizontal: 'center',
                      }
                    : {
                        vertical: 'bottom',
                        horizontal: 'center',
                      }
                }
              >
                <Router />
              </NotistackSnackbarProver>
            </MaterialSnackbarProvider>
          </Theme>
        </ReactReduxFirebaseProvider>
      </ReduxProvider>
    </div>
  );
}

export default App;
