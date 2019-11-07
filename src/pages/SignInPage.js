import React from 'react';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default () => {
  const [uiInstance, setuiInstance] = React.useState();
  console.log('firebase', firebase);
  console.log('firebaseUi: ', firebaseui);
  console.log('uiInstance: ', uiInstance);
  console.log('firebaseui.auth.CredentialHelper.GOOGLE_YOLO: ', firebaseui.auth.CredentialHelper.GOOGLE_YOLO); console.log('firebaseui.auth.CredentialHelper.GOOGLE_YOLO: ', firebaseui.auth.CredentialHelper.GOOGLE_YOLO);
  const uiConfig = {
  // signInFlow: 'popup',
  signInSuccessUrl: '/',
    signInOptions: [
      {
        // Google provider must be enabled in Firebase Console to support one-tap
        // sign-up.
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // Required to enable this provider in one-tap sign-up.
        authMethod: 'https://accounts.google.com',
        // Required to enable ID token credentials for this provider.
        // This can be obtained from the Credentials page of the Google APIs
        // console.
        clientId: '772125171665-ci6st9nbunsrvhv6jdb0e2avmkto9vod.apps.googleusercontent.com',
      },
    ],
    // Required to enable one-tap sign-up credential helper.
    // NOTE: GOOGLE_YOLO is a string "googleyolo".
    // NOTE: We can remove "firebaseui" module to save space by using said string
    // NOTE: Will it take no effect because react-firebaseui relies on it?
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
  };

  console.log('uiConfig: ', uiConfig);
  return (
    <div>
      <br />
      <StyledFirebaseAuth uiCallback={ui => setuiInstance(ui)} uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
);
};
