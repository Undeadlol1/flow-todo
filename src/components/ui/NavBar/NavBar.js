import React, { useState, memo } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, useHistory } from 'react-router-dom';
import { auth, firestore } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { If, Then, Else, When } from 'react-if';
import { useTranslation } from 'react-i18next';
import Slide from '@material-ui/core/Slide';
import Badge from '@material-ui/core/Badge';
import Fade from '@material-ui/core/Fade';
import clsx from 'clsx';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import get from 'lodash/get';
import { useWindowSize } from '@reach/window-size';
import { useTypedSelector } from '../../../store';
import {
  handleErrors,
  calculateUserLevel,
} from '../../../services/index';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // Prevent "Slide" component animation to
    // cause scrollbars to appear
    overflow: 'hidden',
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  avatar: {
    marginRight: '9px',
  },
  username: {
    paddingRight: 0,
  },
  loading: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    },
    [theme.breakpoints.up('lg')]: {
      marginRight: theme.spacing(3),
    },
  },
}));

export const LoginOrLogoutButton = memo(() => {
  const [t] = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const windowSize = useWindowSize();
  const [menuAnchor, setAnchor] = useState(null);

  const [, userLoading, userError] = useAuthState(auth());
  // @ts-ignore
  const user = useTypedSelector(state => state.firebase.auth);
  const [profile, profileLoading, profileError] = useDocumentData(
    user.uid && firestore().doc(`profiles/${user.uid}`),
  );

  const points = get(profile, 'points', 0);
  const hasPhoto = Boolean(user && user.photoURL);
  const isScreenWide = windowSize.width > theme.breakpoints.values.sm;

  function handleButtonClick(event) {
    if (user.isAnonymous) history.push('/signin');
    else setAnchor(event.currentTarget);
  }

  function signOut() {
    return auth()
      .signOut()
      .then(() => history.push('/'))
      .catch(e => console.error(e));
  }

  handleErrors(userError || profileError);

  if (userLoading || profileLoading) {
    return (
      <CircularProgress
        color="secondary"
        className={classes.loading}
      />
    );
  }

  return (
    <>
      <Slide in timeout={500} direction="left">
        <Button
          className={clsx(classes.link, classes.username)}
          onClick={handleButtonClick}
        >
          <If condition={hasPhoto}>
            <Then>
              <Badge
                overlap="circle"
                color="secondary"
                badgeContent={Math.trunc(calculateUserLevel(points))}
              >
                <Avatar
                  className={classes.avatar}
                  src={user.photoURL}
                />
              </Badge>
            </Then>
            <Else>
              <AccountCircle className={classes.avatar} />
            </Else>
          </If>
          <When condition={isScreenWide}>
            <Typography>{user.displayName || user.email}</Typography>
          </When>
        </Button>
      </Slide>
      <Menu
        keepMounted
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem onClick={signOut}>{t('log out')}</MenuItem>
      </Menu>
    </>
  );
});

export default memo(() => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            in
            component={Fade}
            timeout={1500}
            variant="h6"
            className={clsx([classes.link, classes.title])}
          >
            <Link to="/">Flow TODO</Link>
          </Typography>
          <LoginOrLogoutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
});
