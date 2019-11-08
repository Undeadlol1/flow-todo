import React from 'react';
import Grid from '@material-ui/core/Grid';
import firebase from 'firebase/app';
// WIP
// import * as firebaseui from 'firebaseui';
import { makeStyles } from '@material-ui/core/styles';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useTranslation } from 'react-i18next';
import invoke from 'lodash/invoke';

const useStyles = makeStyles(({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
}));

let textIsAlreadySet = false;

function setButtonText(text) {
  if (!textIsAlreadySet) {
    console.assert('setButtonText() query is runnning');
    const textContainer = invoke(document, 'querySelector', '.firebaseui-idp-text');
    if (textContainer) {
      textContainer.innerHTML = text;
      textContainer.textContent = text;
      textIsAlreadySet = true;
    }
  }
}

export default () => {
  const classes = useStyles();
  const [t] = useTranslation();

  React.useEffect(() => {
    const textChangingInterval = setInterval(
      setButtonText.bind(this, t('Sign in with Google')),
      100,
     );
    return function cleanup() {
      textIsAlreadySet = false;
      clearInterval(textChangingInterval);
     };
  }, [t]);

  // WIP
  // https://github.com/Undeadlol1/flow-todo/issues/7
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
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
  };
  const authProps = {
    uiConfig,
    firebaseAuth: firebase.auth(),
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
      <Grid item xs={12} sm={8} md={8} lg={6} align="center">
        <script src="https://www.gstatic.com/firebasejs/ui/4.2.0/firebase-ui-auth__fr.js" />
        <StyledFirebaseAuth {...authProps} />
      </Grid>
    </Grid>
);
};
