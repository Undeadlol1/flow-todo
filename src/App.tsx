import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import firebase from 'firebase/app';
import React, { useMemo, memo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RouterAndDataLoader from './RouterAndDataLoader';
import { initializeI18n } from './services';
import { useDebouncedWindowSize } from './hooks/useDebouncedWindowSize';
import store from './store';
import { Theme } from './Theme';

initializeI18n();

const reduxFirebaseProps = {
  firebase,
  config: {
    userProfile: 'profiles',
    useFirestoreForProfile: true,
  },
  dispatch: store?.dispatch,
  createFirestoreInstance,
};

export function App(props: {
  isStorybookEnv?: boolean;
  children?: JSX.Element;
}) {
  const theme = useMemo(() => createMuiTheme(), []);
  const isMobile =
    // @ts-ignore
    useDebouncedWindowSize(500).width < theme.breakpoints.values.sm;

  return (
    <div className="App">
      <ReduxProvider store={store}>
        <Theme isMobile={isMobile}>
          {props.isStorybookEnv ? (
            <BrowserRouter>{props.children}</BrowserRouter>
          ) : (
            <ReactReduxFirebaseProvider {...reduxFirebaseProps}>
              <RouterAndDataLoader>
                {props.children}
              </RouterAndDataLoader>
            </ReactReduxFirebaseProvider>
          )}
        </Theme>
      </ReduxProvider>
    </div>
  );
}

export default memo(App);
