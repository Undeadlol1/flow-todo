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
// i18n
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import React from 'react';
import en from './locales/en';
import ru from './locales/ru';

import Router from './Router';
import './App.css';

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

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ThemeProvider>
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
  // Use Firestore emulator for local development
  if (process.env.NODE_ENV !== 'production') {
    firebase.firestore().settings({
      ssl: false,
      host: 'localhost:8080',
    });
  }
}

function initializeI18n() {
  // https://github.com/i18next/react-i18next/blob/master/example/react/src/i18n.js
  return i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
        en,
        ru,
      },
    });
}

export default App;
