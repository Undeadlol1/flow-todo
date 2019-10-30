import React from 'react';
import NavBar from './components/ui/NavBar/NavBar';
import CreateTask from './components/tasks/CreateTask/CreateTask';
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
