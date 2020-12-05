import { ButtonBase, Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import clsx from 'clsx';
import debug from 'debug';
import get from 'lodash/get';
import React, { memo } from 'react';
import { Else, If, Then } from 'react-if';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LevelingService from '../../../services/Leveling';
import { useTypedSelector } from '../../../store';
import {
  animationSelector,
  authSelector,
  profileSelector,
  usersSelector,
} from '../../../store/selectors';
import { toggleSidebar } from '../../../store/uiSlice';
import { WrapWithAnimatedNumbers } from '../../unsorted/WrapWithAnimatedNumbers';

const log = debug('NavBar');

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    padding: theme.spacing(0, 1),
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
  flexGrow: {
    flexGrow: 1,
  },
}));

export default memo(function NavBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div className={classes.flexGrow}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
          >
            <MenuIcon />
          </IconButton>
          <ButtonBase>
            <Link
              to="/"
              className={classNames(classes.link, classes.title)}
            >
              <Typography variant="h6" color="textPrimary">
                Долгий Ящик
              </Typography>
            </Link>
          </ButtonBase>
          <Box className={classes.flexGrow} />
          <AvatarWithLevelBadge />
        </Toolbar>
      </AppBar>
    </div>
  );
});

function AvatarWithLevelBadge() {
  const classes = useStyles();

  const user = useTypedSelector(authSelector);
  const profile = useTypedSelector(profileSelector);
  const {
    isPointsRewardingInProgress,
    pointToDisplayDuringRewardAnimation,
  } = useTypedSelector(animationSelector);
  const { isLevelUpAnimationActive } = useTypedSelector(
    usersSelector,
  );
  const experience = get(profile, 'experience', 0);
  // NOTE: "+1" is a quick fix
  const userLevel =
    profile.isLoaded &&
    Math.trunc(LevelingService.calculateUserLevel(experience)) + 1;
  const photoUrl =
    get(user, 'photoURL') || get(user, 'providerData[0].photoURL');

  log('profile: %O', profile);
  log('Is reward animation going: ', isPointsRewardingInProgress);
  log('Points to display: ', pointToDisplayDuringRewardAnimation);

  if (!user.isLoaded) {
    return (
      <CircularProgress
        color="secondary"
        className={classes.loading}
      />
    );
  }

  return (
    <WrapWithAnimatedNumbers
      placement="bottom"
      isVisible={isPointsRewardingInProgress}
      number={pointToDisplayDuringRewardAnimation}
    >
      <Box
        mr={0.5}
        // Prevent "Slide" component animation to
        // cause scrollbars to appear.
        overflow="hidden"
      >
        <Slide in timeout={500} direction="left">
          <Button
            to="/profile"
            component={Link}
            className={clsx(
              classes.link,
              isLevelUpAnimationActive && 'animated pulse infinite',
            )}
          >
            <Badge
              overlap="circle"
              color="secondary"
              badgeContent={userLevel}
            >
              <If condition={!!photoUrl}>
                <Then>
                  <Avatar src={photoUrl} className={classes.avatar} />
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
      </Box>
    </WrapWithAnimatedNumbers>
  );
}
