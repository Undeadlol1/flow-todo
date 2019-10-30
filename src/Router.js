import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import NavBar from './components/ui/NavBar/NavBar';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';

export default function Router() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/task/:taskId">
          <TaskPage />
        </Route>
        <Route path="/signIn">
          <SignInPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
