import Container from '@material-ui/core/Container';
import { auth } from 'firebase/app';
import get from 'lodash/get';
import React, { memo } from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RewardModal from './components/rewards/RewardModal';
import DevelopmentOnlyMenu from './components/ui/DevelopmentOnlyMenu';
import NavBar from './components/ui/NavBar/NavBar';
import Sidebar from './components/ui/Sidebar';
import { ExpirienceProgressBar } from './components/users/ExpirienceProgressBar';
import HomePage from './pages/HomePage/HomePage';
import { ProfilePageContainer } from './pages/ProfilePage/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import SignInPage from './pages/SignInPage';
import TaskPage from './pages/TaskPage';
import { useTypedSelector } from './store/index';
import {
  authSelector,
  uiSelector,
  authErrorSelector,
} from './store/selectors';
import { handleErrors } from './services/index';
import WebShareTargetPage from './pages/WebShareTargetPage';

const today = Date.now();

export default memo(function Router() {
  const user = useTypedSelector(authSelector);
  const authError = useTypedSelector(authErrorSelector);
  const { isRewardModalOpen } = useTypedSelector(uiSelector);
  const userId = get(user, 'uid', '');

  handleErrors(authError);

  if (user.isLoaded && user.isEmpty) {
    auth()
      .signInAnonymously()
      .catch(handleErrors);
  }

  useFirestoreConnect([
    {
      collection: 'tasks',
      where: [
        ['userId', '==', userId],
        ['isDone', '==', false],
        ['dueAt', '<', today],
      ],
      limit: 100,
    },
    {
      doc: userId,
      collection: 'profiles',
      storeAs: 'profile',
    },
    // TODO: make sure this is never used and remove it
    {
      collection: 'tasks',
      where: [
        ['userId', '==', userId],
        ['isDone', '==', false],
        ['dueAt', '<', today],
      ],
      storeAs: 'activeTasks',
      limit: 100,
    },
    {
      collection: 'tasks',
      where: [['userId', '==', userId]],
      storeAs: 'createdAtleastOneTask',
      limit: 1,
    },
    {
      collection: 'rewards',
      where: [['userId', '==', userId]],
      orderBy: ['points', 'asc'],
      limit: 100,
    },
  ]);

  return (
    <BrowserRouter>
      <DevelopmentOnlyMenu />
      <NavBar />
      <ExpirienceProgressBar />
      <Sidebar />
      <RewardModal isOpen={isRewardModalOpen} />
      <Container>
        <Switch>
          <Route path="/tasks/:taskId">
            <TaskPage />
          </Route>
          <Route path="/rewards">
            <RewardsPage />
          </Route>
          <Route path="/signIn">
            <SignInPage />
          </Route>
          <Route path="/profile">
            <ProfilePageContainer />
          </Route>
          <Route path="/web-share-target">
            <WebShareTargetPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
});
