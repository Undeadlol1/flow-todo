import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import { If, Then, Else } from 'react-if';
import { useTranslation } from 'react-i18next';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import clsx from 'clsx';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import get from 'lodash/get';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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

export const LoginOrLogoutButton = () => {
  const [t] = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  const [user, userLoading, userError] = useAuthState(auth());

  const hasPhoto = Boolean(user && user.photoURL);
  const [menuAnchor, setAnchor] = React.useState(null);
  const [profile, profileLoading, profileError] = useDocumentData(
    firestore()
      .collection('profiles')
      .where('userId', '==', user && user.uid),
  );
  const profilePoints = get(profile, 'points', 0);

  // TODO: create "handleErrors" service function
  if (userError || profileError) {
    console.error(userError || profileError);
  }

  if (userLoading || profileLoading) {
    return (
      <CircularProgress
        color="secondary"
        className={classes.loading}
      />
    );
  }

  if (user) {
    const openMenu = event => setAnchor(event.currentTarget);
    const signOut = () => {
      auth()
        .signOut()
        .then(() => history.push('/'))
        .catch(e => console.error(e));
    };
    return (
      <>
        <Slide in timeout={500} direction="left">
          <Button
            className={clsx(classes.link, classes.username)}
            onClick={openMenu}
          >
            <When condition={Boolean(profilePoints)}>
              <Chip
                mr={1}
                component={Box}
                color="secondary"
                label={profilePoints}
              />
            </When>
            <If condition={hasPhoto}>
              <Then>
                <Avatar
                  className={classes.avatar}
                  src={user.photoURL}
                />
              </Then>
              <Else>
                <AccountCircle className={classes.avatar} />
              </Else>
            </If>
            <Typography>{user.displayName}</Typography>
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
  }

  return (
    <Link to="/signIn" className={classes.link}>
      <Button color="inherit">{t('log in')}</Button>
    </Link>
  );
};

export default function NavBar() {
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
}
