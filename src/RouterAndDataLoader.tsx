import Container from '@material-ui/core/Container';
import getHours from 'date-fns/getHours';
import subHours from 'date-fns/subHours';
import get from 'lodash/get';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import useInterval from 'react-use/esm/useInterval';
import RewardModal from './components/rewards/RewardModal';
import DevelopmentOnlyMenu from './components/ui/DevelopmentOnlyMenu';
import { GlobalSnackbarContainer } from './components/ui/GlobalSnackbar';
import NavBar from './components/ui/NavBar/NavBar';
import Sidebar from './components/ui/Sidebar';
import { ExpirienceProgressBar } from './components/users/ExpirienceProgressBar';
import FAQPage from './pages/FAQPage';
import { FocusModePage } from './pages/FocusModePage';
import { IndexPageContainer } from './pages/IndexPage';
import PrivacyPage from './pages/PrivacyPage';
import { ProfilePageContainer } from './pages/ProfilePage/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import SignInPage from './pages/SignInPage';
import { StreaksPage } from './pages/StreaksPage';
import TaskPage from './pages/TaskPage';
import TasksPage from './pages/TasksPage';
import WebShareTargetPage from './pages/WebShareTargetPage';
import { handleErrors } from './services/index';
import {
  authErrorSelector,
  authSelector,
  profileSelector,
  uiSelector,
  usersSelector,
} from './store/selectors';

export default memo((props: { children?: JSX.Element }) => {
  const user = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const { isLevelUpAnimationActive } = useSelector(usersSelector);
  const authError = useSelector(authErrorSelector);
  const { isRewardModalOpen, isSidebarOpen } = useSelector(
    uiSelector,
  );
  const [today, setToday] = useState(Date.now());
  const yesterday = subHours(today, getHours(today)).getTime();

  useInterval(() => {
    console.log('Refetching data every hour...');
    setToday(Date.now());
  }, 1000 * 60 * 60);

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
        storeAs: 'profile',
        collection: 'profiles',
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
      <GlobalSnackbarContainer />
      <Container>
        <Switch>
          <Route path="/tasks/:taskId">
            <TaskPage />
          </Route>
          <Route path="/focus">
            {/* TODO use a container instead of dumb component. */}
            <FocusModePage
              tasksToList={[]}
              isLoading={false}
              tasksForAutoComplete={[]}
            />
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
            <IndexPageContainer />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
});
