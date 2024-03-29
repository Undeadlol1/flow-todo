import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import formatDistance from 'date-fns/formatDistance';
import debug from 'debug';
import get from 'lodash/get';
import i18n from 'i18next';
import formatRelative from 'date-fns/formatRelative';
import en from 'date-fns/locale/en-US';
import ru from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import engnlishStrings from '../locales/en';
import { Reward } from '../store/rewardsSlice';
import sort from 'ramda/es/sort';
import findLastIndex from 'ramda/es/findLastIndex';
import { getFirebase } from 'react-redux-firebase';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en';
import ruTranslations from '../locales/ru';
import Snackbar from './Snackbar';
import { Task } from '../entities/Task';

const logger = debug('utils');

interface Repetition {
  dueAt: number;
  repetitionLevel: number;
}

export type Confidence = 'bad' | 'normal' | 'good';

export function calculateNextRepetition(
  task: Task,
  confidence: Confidence = 'normal',
): Repetition {
  logger('task: ', task);
  logger('confidence: ', confidence);
  const today = new Date();
  const levels = [
    addDays(today, 2),
    addDays(today, 3),
    addDays(today, 5),
    addDays(today, 8),
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
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      projectId: 'flow-todo-5824b',
      measurementId: 'G-DLFD2VSSK1',
      messagingSenderId: '772125171665',
      storageBucket: 'flow-todo-5824b.appspot.com',
      authDomain: 'flow-todo-5824b.firebaseapp.com',
      apiKey: 'AIzaSyAmCyhaB-8xjMH5yi9PoitoAyD-KeFnNtA',
      appId: '1:772125171665:web:3fffadc4031335de290af0',
      databaseURL: 'https://flow-todo-5824b.firebaseio.com',
    });
  }

  if (process.env.NODE_ENV === 'production') {
    firebase.analytics();
    firebase.performance();
    firebase
      .firestore()
      .enablePersistence({
        synchronizeTabs: true,
      })
      .catch(console.error);
  } else {
    // Use Firestore emulator for local development
    firebase.firestore().settings({
      // ssl: false,
      // host: 'localhost:8080',
    });
  }

  return firebase;
}

export function handleErrors(
  e: Error | undefined | firebase.auth.Error,
) {
  if (e) {
    const errorMessage = `Error: ${
      e?.message || i18n.t('Something went wrong')
    }`;

    console.error(e);
    Snackbar.addToQueue(errorMessage);
  }
}

export function showSnackbar(message: string) {
  Snackbar.addToQueue(message);
}

export function getNewlyUnlockedReward(
  currentPoints: number,
  pointsAboutToAdd: number,
  rewards: Reward[],
): Reward | undefined {
  const sortedRewards = sort((a, b) => a.points - b.points, rewards);
  const currentRewardIndex = findLastIndex(
    (i) => i.points <= currentPoints,
    rewards,
  );
  const nextRewardIndex = findLastIndex(
    (i) => i.points <= currentPoints + pointsAboutToAdd,
    rewards,
  );
  const nextReward = rewards[nextRewardIndex];
  logger('sortedRewards: ', sortedRewards);
  logger('currentRewardIndex: ', currentRewardIndex);
  logger('nextRewardIndex: ', nextRewardIndex);
  logger('nextReward: ', nextReward);
  if (
    nextRewardIndex !== -1 &&
    nextReward.points <= currentPoints + pointsAboutToAdd &&
    currentRewardIndex &&
    get(rewards, `[${currentRewardIndex}].points`) !==
      nextReward.points
  )
    return nextReward;
}

const dateLocales = { en, ru };

export function formatRelativeDate(
  dateToFormat: Date | number,
  dateToCompareWith: Date | number,
) {
  return formatRelative(dateToFormat, dateToCompareWith, {
    // @ts-ignore
    locale: dateLocales[i18n.language],
  });
}

export function distanceBetweenDates(
  dateToFormat: Date | number,
  dateToCompareWith: Date | number,
) {
  return formatDistance(dateToFormat, dateToCompareWith, {
    // @ts-ignore
    locale: dateLocales[i18n.language],
    addSuffix: false,
  });
}

export function useTypedTranslate() {
  const { t } = useTranslation();
  return (
    key: keyof typeof engnlishStrings.translation,
    ...rest: any
  ) => t(key, ...rest);
}

export function getFirestore() {
  return getFirebase().firestore();
}

export function initializeI18n() {
  if (i18n.isInitialized) {
    return i18n;
  }
  return i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      lng: 'en',
      debug: false,
      fallbackLng: 'en',
      interpolation: {
        // not needed for react as it escapes by default
        escapeValue: false,
      },
      resources: {
        en: enTranslations,
        ru: ruTranslations,
      },
    });
}
