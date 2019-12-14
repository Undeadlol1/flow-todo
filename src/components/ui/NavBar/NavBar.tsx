import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import debug from 'debug';
import { auth } from 'firebase/app';
import get from 'lodash/get';
import React, { memo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Else, If, Then } from 'react-if';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  calculateUserLevel,
  handleErrors,
} from '../../../services/index';
import { Profile, useTypedSelector } from '../../../store';
import { toggleSidebar } from '../../../store/uiSlice';
import UserPoints from '../../users/UserPoints';
import Box from '@material-ui/core/Box';

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
  loading: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    },
    [theme.breakpoints.up('lg')]: {
      marginRight: theme.spacing(3),
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export const LoginOrLogoutButton = memo(() => {
  const classes = useStyles();

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
          component={Link}
          to="/profile"
          className={clsx(
            classes.link,
            isLevelUpAnimationActive && 'animated pulse infinite',
          )}
        >
          <Box mr={0.5}>
            <UserPoints value={points} />
          </Box>
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
                  className={clsx(classes.avatar, classes.large)}
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
        </Button>
      </Slide>
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
