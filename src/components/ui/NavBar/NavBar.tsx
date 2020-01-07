import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
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
import get from 'lodash/get';
import React, { memo } from 'react';
import { Else, If, Then } from 'react-if';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { calculateUserLevel } from '../../../services/index';
import { useTypedSelector } from '../../../store';
import {
  authSelector,
  profileSelector,
  usersSelector,
} from '../../../store/selectors';
import { toggleSidebar } from '../../../store/uiSlice';
import UserPoints from '../../users/UserPoints';
import { profilePointsSelector } from '../../../store/selectors';

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
}));

export const LoginOrLogoutButton = memo(() => {
  const classes = useStyles();

  const user = useTypedSelector(authSelector);
  const profile = useTypedSelector(profileSelector);
  const { isLevelUpAnimationActive } = useTypedSelector(
    usersSelector,
  );
  const points = useTypedSelector(profilePointsSelector);
  const experience = get(profile, 'experience', 0);
  const hasPhoto = Boolean(user && user.photoURL);
  log('profile: ', profile);
  // TODO: find out how to handle auth errors in redux-firebase
  // handleErrors(userError);

  if (!user.isLoaded) {
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
        <Box mr={0.5}>
          <Button
            component={Link}
            to="/profile"
            className={clsx(
              classes.link,
              isLevelUpAnimationActive && 'animated pulse infinite',
            )}
          >
            <UserPoints value={points} isLoaded={profile.isLoaded} />
          </Button>
          <Button
            component={Link}
            to="/profile"
            className={clsx(
              classes.link,
              isLevelUpAnimationActive && 'animated pulse infinite',
            )}
          >
            <Badge
              overlap="circle"
              color="secondary"
              // NOTE: "+1" is a quick fix
              badgeContent={
                profile.isLoaded &&
                Math.trunc(calculateUserLevel(experience)) + 1
              }
            >
              <If condition={hasPhoto}>
                <Then>
                  <Avatar
                    src={user.photoURL as string}
                    className={clsx(classes.avatar)}
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
        </Box>
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
