import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { firestore, auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import NavBar from './components/ui/NavBar/NavBar';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import { TasksContext } from './store/contexts';

const today = Date.now();

export default function Router() {
  const [user, userLoading, userError] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, tasksLoading, tasksError] = useCollection(
    user &&
      db
        .where('userId', '==', user.uid)
        .where('isDone', '==', false)
        .where('dueAt', '<', today),
  );
  const providerValue = {
    currentTask: {},
    error: tasksError || userError,
    loading: tasksLoading || userLoading,
    tasks: tasks || ({} as firestore.QuerySnapshot),
  };
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Switch>
          <Route path="/tasks/:taskId">
            <TasksContext.Provider value={providerValue}>
              <TaskPage />
            </TasksContext.Provider>
          </Route>
          <Route path="/signIn">
            <SignInPage />
          </Route>
          <Route path="/">
            <TasksContext.Provider value={providerValue}>
              <HomePage />
            </TasksContext.Provider>
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}
