import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import formatDistance from 'date-fns/formatDistance';
import debug from 'debug';
import { firestore } from 'firebase';
import get from 'lodash/get';
import i18n from 'i18next';
import { snackbarActions } from 'material-ui-snackbar-redux';
import store from '../store';

const logger = debug('utils');

interface Task {
  repetitionLevel: number | undefined;
}

interface Repetition {
  dueAt: number;
  repetitionLevel: number;
}

export function calculateNextRepetition(
  task: Task,
  confidence = 'bad' || 'normal' || 'good',
): Repetition {
  if (!confidence) confidence = 'normal';
  logger('task: ', task);
  logger('confidence: ', confidence);
  const today = new Date();
  const levels = [
    addDays(today, 1),
    addDays(today, 2),
    addDays(today, 4),
    addDays(today, 7),
    addDays(today, 14),
    addDays(today, 28),
    addMonths(today, 2),
    addMonths(today, 3),
    addMonths(today, 6),
  ];

  let newLevelIndex = -1;

  if (task.repetitionLevel || task.repetitionLevel === 0) {
    newLevelIndex = task.repetitionLevel;
  }

  if (confidence === 'normal') newLevelIndex += 1;
  else if (confidence === 'good') newLevelIndex += 2;
  else if (confidence === 'bad') newLevelIndex -= 2;

  if (newLevelIndex < 0) newLevelIndex = 0;
  else if (newLevelIndex >= levels.length)
    newLevelIndex = levels.length - 1;

  logger('levels: %O', levels);
  logger('newLevelIndex: ', newLevelIndex);
  const dueAt = levels[newLevelIndex];
  logger('dueAt', dueAt);
  logger(`New dueAt is ${formatDistance(today, dueAt)} from now`);

  return {
    dueAt: dueAt.getTime(),
    repetitionLevel: newLevelIndex,
  };
}

export function initializeFirebase() {
  firebase.initializeApp({
    apiKey: 'AIzaSyAmCyhaB-8xjMH5yi9PoitoAyD-KeFnNtA',
    authDomain: 'flow-todo-5824b.firebaseapp.com',
    databaseURL: 'https://flow-todo-5824b.firebaseio.com',
    projectId: 'flow-todo-5824b',
    storageBucket: 'flow-todo-5824b.appspot.com',
    messagingSenderId: '772125171665',
    appId: '1:772125171665:web:3fffadc4031335de290af0',
    measurementId: 'G-DLFD2VSSK1',
  });

  const firestore = firebase.firestore();
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    firestore
      .enablePersistence({
        synchronizeTabs: true,
      })
      .catch(e => console.error(e));
    // TODO: test to see if this is needed
    // https://firebase.google.com/docs/firestore/manage-data/enable-offline#disable_and_enable_network_access
    // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events#Example
    // (function listenForConnectivity() {
    //   window.addEventListener('online', firestore.enableNetwork());
    //   window.addEventListener('offline', firestore.disableNetwork());
    // }());
  } else {
    // Use Firestore emulator for local development
    firestore.settings({
      ssl: false,
      host: 'localhost:8080',
    });
  }
  return firebase;
}

export function normalizeQueryResponse(
  snapshot: firestore.QuerySnapshot,
) {
  if (snapshot.empty) return [];
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data(),
  }));
}

export function handleErrors(e: Error | undefined) {
  if (e) {
    console.error('handleErrors', e);
    store.dispatch(
      snackbarActions.show({
        message:
          'Error: ' + get(e, 'message') ||
          i18n.t('Something went wrong'),
      }),
    );
  }
}

export function showSnackbar(message: string) {
  store.dispatch(
    snackbarActions.show({
      message,
    }),
  );
}

export function calculateUserLevel(points: number): number {
  return (points * 3) / 100;
}
