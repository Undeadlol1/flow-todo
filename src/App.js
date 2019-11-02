// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import isDarkMode from 'is-dark';
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

const theme = createMuiTheme({
  palette: {
    type: isDarkMode() ? 'dark' : 'light',
    primary: { main: '#81D4FA' },
    secondary: { main: '#00838F', contrastText: '#ffffff' },
  },
  themeName: 'Malibu Blue Lagoon Zebu',
});

const rootStyle = {
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
};

function App() {
  return (
    <div className="App" style={rootStyle}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
