import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { useWindowSize } from '@reach/window-size';
import clsx from 'clsx';
import debug from 'debug';
import { auth } from 'firebase/app';
import get from 'lodash/get';
import React, { memo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import { Else, If, Then, When } from 'react-if';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  calculateUserLevel,
  handleErrors,
} from '../../../services/index';
import { Profile, useTypedSelector } from '../../../store';
import { toggleSidebar } from '../../../store/uiSlice';
import UserPoints from '../../users/UserPoints';

const log = debug('NavBar');

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
  const profile = useTypedSelector(
    s => s.firestore.data.profile as Profile,
  );
  const { isLevelUpAnimationActive } = useTypedSelector(s => s.users);

  const points = get(profile, 'points', 0);
  log('profile: ', profile);
  const experience = get(profile, 'experience', 0);
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

  handleErrors(userError);

  if (userLoading) {
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
          <UserPoints value={points} />
          <Badge
            overlap="circle"
            color="secondary"
            // NOTE: "+1" is a quick fix
            badgeContent={
              Math.trunc(calculateUserLevel(experience)) + 1
            }
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
