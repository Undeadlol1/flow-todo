import React from 'react';
import CreateTask from './components/tasks/CreateTask/CreateTask';
import NavBar from './components/ui/NavBar/NavBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <CreateTask />
    </div>
  );
}

export default App;
