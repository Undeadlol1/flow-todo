import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { actionTypes, firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer, reduxFirestore } from 'redux-firestore';
import { initializeFirebase } from '../services/index';
import animationSlice from './animationSlice';
import rewardsSlice from './rewardsSlice';
import snackbarsSlice from './snackbarsSlice';
import tagsSlice from './tagsSlice';
import tasksSlice from './tasksSlice';
import uiSlice from './uiSlice';
import userSlice from './usersSlice';

initializeFirebase();

const rootReducer = combineReducers({
  ui: uiSlice,
  tags: tagsSlice,
  users: userSlice,
  tasks: tasksSlice,
  rewards: rewardsSlice,
  snackbars: snackbarsSlice,
  animation: animationSlice,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      // Firebase.auth onlogin error fix.
      // https://github.com/prescottprue/react-redux-firebase/issues/761
      serializableCheck: {
        ignoredActions: [actionTypes.LOGIN],
      },
    }),
  ],
  devTools: process.env.NODE_ENV !== 'test',
  // @ts-ignore
  enhancers: [reduxFirestore(firebase)],
});

export type RootReducer = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<
  ReturnType<typeof rootReducer>
> = useSelector;

export default store;
