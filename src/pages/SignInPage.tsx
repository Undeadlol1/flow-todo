import React, { memo, Profiler } from 'react';
import Grid from '@material-ui/core/Grid';
import firebase, { auth, User, firestore } from 'firebase/app';
// WIP
// import * as firebaseui from 'firebaseui';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AppTour from '../components/ui/AppTour';
import clsx from 'clsx';
import FirebaseUIAuth from 'react-firebaseui-localized';
import { handleErrors, showSnackbar } from '../services/index';
import { addPoints } from '../store/index';
import { useHistory } from 'react-router-dom';
import debug from 'debug';
import nanoid from 'nanoid';
import get from 'lodash/get';

const log = debug('SigninPage');
debug.enable('SigninPage store');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  buttonsContainer: {
    minWidth: '150px',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default memo(() => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();
  const history = useHistory();

  async function mergeAnonymousUpgradeConflicts(error: any) {
    const db = firestore();
    const batch = firestore().batch();

    try {
      if (
        error.code !== 'firebaseui/anonymous-upgrade-merge-conflict'
      ) {
        handleErrors(error);
        return Promise.resolve();
      }

      const anonymousUser = auth().currentUser as User;
      const anonymousUserProfile = await db
        .doc('profiles/' + anonymousUser.uid)
        .get();
      const anonymousUserTasks = await db
        .collection('tasks')
        .where('userId', '==', anonymousUser.uid)
        .get();
      const nonAnonymousUser = get(
        await auth().signInWithCredential(error.credential),
        'user',
      ) as User;

      log('signedInUser: ', nonAnonymousUser);
      log('anonymousUser: ', anonymousUser);
      log('anonymousUserTasks: ', anonymousUserTasks);
      log('anonymousUserProfile: ', anonymousUserProfile);

      if (anonymousUserProfile.exists) {
        await addPoints(
          nonAnonymousUser.uid,
          anonymousUserProfile.get('points'),
        );
      }
      if (!anonymousUserTasks.empty) {
        for (const task of anonymousUserTasks.docs) {
          const taskToUpdate = db.collection('tasks').doc(nanoid());
          batch.set(taskToUpdate, {
            ...task.data(),
            userId: nonAnonymousUser.uid,
          });
        }
      }

      await batch.commit();
      await anonymousUser.delete();
      /*
        NOTE: currently there is no way to delete anonymous users tasks and
        profile after .signInWithCredential is called. Reason for this is simple:
        new signed in user can't bypass database "delete" rules. Users can only
        delete their own documents.
        TODO: add server side functions to delete anonymous user data
        NOTE: perhaps it is simplier to oldTask.update({userId: newUserId})
        rather than creating a new task and deleting an old one
      */
      // await delete anonymous user profile
      // await delete anonymous user tasks
      history.push('/');
    } catch (finalError) {
      showSnackbar(t('seems like anonymous upgrading failed'));
      handleErrors(finalError);
    }
  }

  // WIP
  // https://github.com/Undeadlol1/flow-todo/issues/7
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    autoUpgradeAnonymousUsers: true,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //   {
      //     // Google provider must be enabled in Firebase Console to support one-tap
      //     // sign-up.
      //     provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //     // Required to enable this provider in one-tap sign-up.
      //     authMethod: 'https://accounts.google.com',
      //     // Required to enable ID token credentials for this provider.
      //     // This can be obtained from the Credentials page of the Google APIs
      //     // console.
      //     clientId: '772125171665-ci6st9nbunsrvhv6jdb0e2avmkto9vod.apps.googleusercontent.com',
      //   },
    ],
    // Required to enable one-tap sign-up credential helper.
    // NOTE: GOOGLE_YOLO is a string "googleyolo".
    // NOTE: We can remove "firebaseui" module to save space by using said string
    // NOTE: Will it take no effect because react-firebaseui relies on it?
    // // credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    callbacks: {
      signInFailure: mergeAnonymousUpgradeConflicts,
    },
  };

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      direction="column"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={8} md={8} lg={6}>
        <div
          className={clsx([
            classes.buttonsContainer,
            'IntroHandle__signupButtons',
          ])}
        >
          <FirebaseUIAuth
            config={uiConfig}
            firebase={firebase}
            lang={i18n.language}
            auth={firebase.auth()}
          />
        </div>
      </Grid>
      <AppTour step={3} />
    </Grid>
  );
});
