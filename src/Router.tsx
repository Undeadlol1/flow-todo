import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import NavBar from './components/ui/NavBar/NavBar';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';

export default function Router() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Switch>
          <Route path="/tasks/:taskId">
            <TaskPage />
          </Route>
          <Route path="/signIn">
            <SignInPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}
