import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import firebase from 'firebase/app';
import React, { memo, useMemo } from 'react';
import FirebaseUIAuth from 'react-firebaseui-localized';
import { useTranslation } from 'react-i18next';
import AppTour from '../components/ui/AppTour';

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  buttonsContainer: {
    minWidth: '150px',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  autoUpgradeAnonymousUsers: true,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

export default memo(function SignInPage() {
  const classes = useStyles();
  const [, i18n] = useTranslation();

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
    [i18n, classes],
  );
});
