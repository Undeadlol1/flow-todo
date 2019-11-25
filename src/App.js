import React from 'react';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SnackbarProvider } from 'notistack';
import { useWindowSize } from '@reach/window-size';
// i18n
import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// Other
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider as MaterialSnackbarProvider } from 'material-ui-snackbar-redux';

import Router from './Router';
import en from './locales/en';
import ru from './locales/ru';
import './App.css';
import store from './store';

initializeFirebase();
initializeI18n();

function App() {
  const prefersDarkMode = useMediaQuery(
    '(prefers-color-scheme: dark)',
  );
  const theme = React.useMemo(
    () => createMuiTheme({
      palette: {
        primary: { main: '#81D4FA' },
        secondary: { main: '#00838F', contrastText: '#ffffff' },
        type: prefersDarkMode ? 'dark' : 'light',
      },
      themeName: 'Malibu Blue Lagoon Zebu',
    }),
    [prefersDarkMode],
  );
  const windowSize = useWindowSize();
  const isScreenNarrow = windowSize.width < theme.breakpoints.values.sm;

  return (
    <div className="App">
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MaterialSnackbarProvider
            SnackbarProps={{ autoHideDuration: 4000 }}
          >
            <SnackbarProvider dense={isScreenNarrow}>
              <Router />
            </SnackbarProvider>
          </MaterialSnackbarProvider>
        </ThemeProvider>
      </ReduxProvider>
    </div>
  );
}

function initializeFirebase() {
  firebase.initializeApp({
    apiKey: 'AIzaSyAmCyhaB-8xjMH5yi9PoitoAyD-KeFnNtA',
    authDomain: 'flow-todo-5824b.firebaseapp.com',
    databaseURL: 'https://flow-todo-5824b.firebaseio.com',
    projectId: 'flow-todo-5824b',
    storageBucket: 'flow-todo-5824b.appspot.com',
    messagingSenderId: '772125171665',
    appId: '1:772125171665:web:3fffadc4031335de290af0',
    measurementId: 'G-DLFD2VSSK1',
  });

  const firestore = firebase.firestore();
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    firestore
      .enablePersistence({
        synchronizeTabs: true,
      })
      .catch(e => console.error(e));
    // TODO: test to see if this is needed
    // https://firebase.google.com/docs/firestore/manage-data/enable-offline#disable_and_enable_network_access
    // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events#Example
    // (function listenForConnectivity() {
    //   window.addEventListener('online', firestore.enableNetwork());
    //   window.addEventListener('offline', firestore.disableNetwork());
    // }());
  } else {
    // Use Firestore emulator for local development
    firestore.settings({
      ssl: false,
      host: 'localhost:8080',
    });
  }
}

function initializeI18n() {
  return i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      lng: 'ru',
      debug: false,
      fallbackLng: 'en',
      interpolation: {
        // not needed for react as it escapes by default
        escapeValue: false,
      },
      resources: {
        en,
        ru,
      },
    });
}

export default App;
