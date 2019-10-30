// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import React from 'react';
import NavBar from './components/ui/NavBar/NavBar';
import CreateTask from './components/tasks/CreateTask/CreateTask';
import './App.css';

// Initialize Firebase
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

function App() {
  return (
    <div className="App">
      <NavBar />
      <CreateTask />
    </div>
  );
}

export default App;
