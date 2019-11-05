import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { If, Unless } from 'react-if';
import { useTranslation } from 'react-i18next';

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
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Flow TODO
            </Link>
          </Typography>
          <LoginOrLogoutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export const LoginOrLogoutButton = () => {
  const [t] = useTranslation();
  const classes = useStyles();
  const [user, loading] = useAuthState(auth());
  const [menuAnchor, setAnchor] = React.useState(null);
  const hasPhoto = Boolean(user && user.photoURL);
  if (loading) return <CircularProgress color="secondary" />;
  if (user) {
    const openMenu = event => setAnchor(event.currentTarget);
    const signOut = () => auth().signOut();
    return (
      <>
        <Button
          className={`${classes.link} ${classes.username}`}
          onClick={openMenu}
        >
          <If condition={hasPhoto}>
            <Avatar className={classes.avatar} src={user.photoURL} />
          </If>
          <Unless condition={hasPhoto}>
            <AccountCircle className={classes.avatar} />
          </Unless>
          <Typography>{user.displayName}</Typography>
        </Button>
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
