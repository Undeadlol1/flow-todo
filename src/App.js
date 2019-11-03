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

import React from 'react';
import Router from './Router';
import './App.css';

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

export default App;
