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
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../store';
import { toggleSidebar } from '../../../store/uiSlice';
import {
  handleErrors,
  calculateUserLevel,
} from '../../../services/index';
import UserPoints from '../../users/UserPoints';

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
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    },
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
  const [menuAnchor, setAnchor] = useState();

  const [, userLoading, userError] = useAuthState(auth());
  // @ts-ignore
  const user = useTypedSelector(state => state.firebase.auth);
  const { isLevelUpAnimationActive } = useTypedSelector(s => s.users);
  const [profile, profileLoading, profileError] = useDocumentData(
    user.uid && firestore().doc(`profiles/${user.uid}`),
  );

  const points = get(profile, 'points', 0);
  const hasPhoto = Boolean(user && user.photoURL);
  const isScreenWide = windowSize.width > theme.breakpoints.values.sm;

  function handleUsernameClick(event: React.MouseEvent<HTMLElement>) {
    if (user.isAnonymous) history.push('/signin');
    else setAnchor(event.currentTarget);
  }

  function signOut() {
    return auth()
      .signOut()
      .then(() => history.push('/'))
      .catch(handleErrors);
  }

  handleErrors((userError || profileError) as Error);

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
          className={clsx(
            classes.link,
            classes.username,
            isLevelUpAnimationActive && 'animated pulse infinite',
          )}
          onClick={handleUsernameClick}
        >
          {/* TODO change "points" to "coins" or something else */}
          {/* NOTE during development I realized there must be two types of data: */}
          {/* "expirience"(a way to calculate level) and "coins"(currency to spend on rewards) */}
          {/* previously both of them were simply called "points" */}
          <UserPoints value={profile.coins} />
          <Badge
            overlap="circle"
            color="secondary"
            // NOTE: "+1" is a quick fix
            badgeContent={Math.trunc(calculateUserLevel(points)) + 1}
          >
            <If condition={hasPhoto}>
              <Then>
                <Avatar
                  src={user.photoURL}
                  className={classes.avatar}
                />
              </Then>
              <Else>
                <AccountCircle
                  fontSize="large"
                  className={classes.avatar}
                />
              </Else>
            </If>
          </Badge>
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
  const dispatch = useDispatch();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
          >
            <MenuIcon />
          </IconButton>
          <Fade in timeout={1500}>
            <Typography
              variant="h6"
              className={clsx([classes.title])}
            >
              <Link className={classes.link} to="/">
                Flow TODO
              </Link>
            </Typography>
          </Fade>
          <LoginOrLogoutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
});
