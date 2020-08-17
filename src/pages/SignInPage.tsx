import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import debug from 'debug';
import firebase, { auth, firestore, User } from 'firebase/app';
import get from 'lodash/get';
import nanoid from 'nanoid';
import React, { memo, useMemo } from 'react';
import FirebaseUIAuth from 'react-firebaseui-localized';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AppTour from '../components/ui/AppTour';
import { handleErrors, showSnackbar } from '../services/index';
import { addPoints } from '../store/index';

const log = debug('SigninPage');
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
    console.warn('mergeAnonymousUpgradeConflicts: ');
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
      const anonymousUserRewards = await db
        .collection('rewards')
        .where('userId', '==', anonymousUser.uid)
        .get();
      const nonAnonymousUser = get(
        await auth().signInWithCredential(error.credential),
        'user',
      ) as User;

      log('signedInUser: ', nonAnonymousUser);
      log('anonymousUser: ', anonymousUser);
      log('anonymousUserTasks: ', anonymousUserTasks);
      log('anonymousUserRewards: ', anonymousUserRewards);
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
      if (!anonymousUserRewards.empty) {
        for (const reward of anonymousUserRewards.docs) {
          const rewardToUpdate = db
            .collection('rewards')
            .doc(nanoid());
          batch.set(rewardToUpdate, {
            ...reward.data(),
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

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    autoUpgradeAnonymousUsers: true,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInFailure: mergeAnonymousUpgradeConflicts,
    },
  };

  return useMemo(
    () => (
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
          <div className={classes.buttonsContainer}>
            <FirebaseUIAuth
              key={123}
              config={uiConfig}
              firebase={firebase}
              lang={i18n.language}
              auth={firebase.auth()}
            />
          </div>
        </Grid>
        <AppTour step={3} />
      </Grid>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n, classes],
  );
});
