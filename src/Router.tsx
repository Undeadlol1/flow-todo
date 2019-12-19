import Container from '@material-ui/core/Container';
import subtractHours from 'date-fns/subHours';
import { auth, firestore, UserInfo } from 'firebase/app';
import React, { memo, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDispatch } from 'react-redux';
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
import { normalizeQueryResponse } from './services/index';
import { TasksContext } from './store/contexts';
import { useTypedSelector } from './store/index';
import { getTasksSuccess } from './store/tasksSlice';
import { login, logout } from './store/usersSlice';
import WebShareTargetPage from './pages/WebShareTargetPage';

const today = Date.now();
const lastSixteenHours = subtractHours(new Date(), 16).getTime();

export default memo(function Router() {
  const dispatch = useDispatch();
  const db = firestore().collection('tasks');
  // @ts-ignore
  const userAuth = useTypedSelector(state => state.firebase.auth);
  const { isRewardModalOpen } = useTypedSelector(s => s.ui);

  const [user, userLoading, userError] = useAuthState(auth());
  const userId = useTypedSelector(state => state.users.current.uid);

  if (userAuth.isEmpty && userAuth.isLoaded) {
    auth()
      .signInAnonymously()
      .then(() => {
        console.info('anonymous login was successful');
      })
      .catch(function(error) {
        console.error('anonymous signin error: ', error);
      });
  }

  useFirestoreConnect([
    {
      collection: 'profiles',
      doc: userAuth!.uid,
      storeAs: 'profile',
    },
    {
      collection: 'tasks',
      where: [
        ['userId', '==', userId],
        ['isDone', '==', false],
        ['dueAt', '<', today],
      ],
      storeAs: 'activeTasks',
    },
    {
      collection: 'tasks',
      where: [
        ['userId', '==', userId],
        ['isDone', '==', true],
        ['doneAt', '>', lastSixteenHours],
      ],
      storeAs: 'tasksDoneToday',
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
      // where: [['userId', '==', userId], ['isDone', '==', false]],
    },
  ]);

  useEffect(() => {
    if (!userLoading) {
      if (user) dispatch(login(user.toJSON() as UserInfo));
      else dispatch(logout(user));
    }
  }, [userLoading, user, dispatch]);

  useEffect(() => {
    const unsubscribe = db
      .where('userId', '==', userId)
      .where('isDone', '==', false)
      .where('dueAt', '<', today)
      .onSnapshot(
        tasksSnapshot => {
          dispatch(
            getTasksSuccess(
              // @ts-ignore
              normalizeQueryResponse(tasksSnapshot),
            ),
          );
        },
        error => {
          console.error('tasks snapshot returned error', error);
        },
      );
    return () => unsubscribe();
  }, [userId, db, dispatch]);

  const [tasks, tasksLoading, tasksError] = useCollection(
    user &&
      db
        .where('userId', '==', user.uid)
        .where('isDone', '==', false)
        .where('dueAt', '<', today),
  );

  const [
    tasksDoneToday,
    tasksDoneTodayLoading,
    tasksDoneTodayError,
  ] = useCollection(
    user &&
      db
        .where('userId', '==', user && user.uid)
        .where('isDone', '==', true)
        .where('doneAt', '>', lastSixteenHours),
  );

  const providerValue = {
    currentTask: {},
    tasks: tasks || ({} as firestore.QuerySnapshot),
    error: tasksError || userError || tasksDoneTodayError,
    loading: tasksLoading || userLoading || tasksDoneTodayLoading,
    tasksDoneToday: tasksDoneToday || ({} as firestore.QuerySnapshot),
  };
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
            <TasksContext.Provider value={providerValue}>
              <TaskPage />
            </TasksContext.Provider>
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
            <TasksContext.Provider value={providerValue}>
              <HomePage />
            </TasksContext.Provider>
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
});
