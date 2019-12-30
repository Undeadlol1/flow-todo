import React from 'react';
import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SnackbarProvider as NotistackSnackbarProver } from 'notistack';
import { useWindowSize } from '@reach/window-size';
import i18n from 'i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider as MaterialSnackbarProvider } from 'material-ui-snackbar-redux';
import firebase from 'firebase/app';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { ruRU, enUS } from '@material-ui/core/locale/';
import store from './store';
import Router from './Router';
import './App.css';
import { initializeI18n } from './services';

initializeI18n();

function App() {
  const { language } = i18n;
  const prefersDarkMode = useMediaQuery(
    '(prefers-color-scheme: dark)',
  );
  const theme = React.useMemo(
    () =>
      createMuiTheme(
        {
          palette: {
            primary: { main: '#81D4FA' },
            secondary: { main: '#00838F', contrastText: '#ffffff' },
            type: prefersDarkMode ? 'dark' : 'light',
          },
        },
        // @ts-ignore
        { ru: ruRU, en: enUS }[language],
      ),
    [language, prefersDarkMode],
  );
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
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MaterialSnackbarProvider
              SnackbarProps={{ autoHideDuration: 4000 }}
            >
              <NotistackSnackbarProver
                autoHideDuration={3500}
                dense={isMobile}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <Router />
              </NotistackSnackbarProver>
            </MaterialSnackbarProvider>
          </ThemeProvider>
        </ReactReduxFirebaseProvider>
      </ReduxProvider>
    </div>
  );
}

export default App;
