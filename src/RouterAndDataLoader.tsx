import Container from '@material-ui/core/Container';
import get from 'lodash/get';
import React, { memo, useEffect, useState } from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RewardModal from './components/rewards/RewardModal';
import DevelopmentOnlyMenu from './components/ui/DevelopmentOnlyMenu';
import NavBar from './components/ui/NavBar/NavBar';
import Sidebar from './components/ui/Sidebar';
import { ExpirienceProgressBar } from './components/users/ExpirienceProgressBar';
import HomePage from './pages/IndexPage/IndexPage';
import { ProfilePageContainer } from './pages/ProfilePage/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import SignInPage from './pages/SignInPage';
import TaskPage from './pages/TaskPage';
import { useTypedSelector } from './store/index';
import {
  authSelector,
  uiSelector,
  authErrorSelector,
  usersSelector,
  tasksSelector,
} from './store/selectors';
import { handleErrors } from './services/index';
import WebShareTargetPage from './pages/WebShareTargetPage';
import FAQPage from './pages/FAQPage';
import subHours from 'date-fns/subHours';
import getHours from 'date-fns/getHours';
import TasksPage from './pages/TasksPage';
import useInterval from 'react-use/esm/useInterval';
import PrivacyPage from './pages/PrivacyPage';
import { profileSelector } from './store/selectors';
import isEmpty from 'lodash/isEmpty';
import { StreaksPage } from './pages/StreaksPage';

export default memo(function RouterAndDataLoader(props: {
  children?: JSX.Element;
}) {
  const user = useTypedSelector(authSelector);
  const profile = useTypedSelector(profileSelector);
  const tasks = useTypedSelector(tasksSelector);
  const { isLevelUpAnimationActive } = useTypedSelector(
    usersSelector,
  );
  const authError = useTypedSelector(authErrorSelector);
  const { isRewardModalOpen, isSidebarOpen } = useTypedSelector(
    uiSelector,
  );
  const [today, setToday] = useState(Date.now());
  const yesterday = subHours(today, getHours(today)).getTime();

  // Refetch data every hour.
  const dataRefetchInterval = 1000 * 60 * 60;
  useInterval(() => {
    console.log(`Refetching data every hour...`);
    setToday(Date.now());
  }, dataRefetchInterval);

  // Store userId in localStorage to improve loading times on startup
  const userId =
    get(user, 'uid', '') || localStorage.getItem('userId') || '';
  useEffect(() => {
    if (userId) localStorage.setItem('userId', userId);
  }, [userId]);

  handleErrors(authError);

  useFirestoreConnect(
    userId && [
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
        collection: 'taskLogs',
        where: [
          ['userId', '==', userId],
          ['createdAt', '>', yesterday],
        ],
        limit: 100,
      },
      {
        collection: 'tasks',
        where: [
          ['userId', '==', userId],
          ['isPinned', '==', true],
        ],
        storeAs: 'pinnedTask',
        limit: 1,
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
    ],
  );

  return (
    <BrowserRouter>
      {props.children}
      <DevelopmentOnlyMenu />
      <NavBar />
      <ExpirienceProgressBar
        profile={profile}
        isAnimationActive={isLevelUpAnimationActive}
      />
      <Sidebar isOpen={isSidebarOpen} isLoggedIn={!user.isEmpty} />
      <RewardModal isOpen={isRewardModalOpen} />
      <Container>
        <Switch>
          <Route path="/tasks/:taskId">
            <TaskPage />
          </Route>
          <Route path="/tasks">
            <TasksPage />
          </Route>
          <Route path="/streaks">
            <StreaksPage />
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
          <Route path="/faq">
            <FAQPage />
          </Route>
          <Route path="/privacy">
            <PrivacyPage />
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
