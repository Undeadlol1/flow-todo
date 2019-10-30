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

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
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
              App
            </Link>
          </Typography>
          <LoginOrLogoutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export const LoginOrLogoutButton = () => {
  const classes = useStyles();
  const [user, loading] = useAuthState(auth());
  const [menuAnchor, setAnchor] = React.useState(null);
  if (loading) return <CircularProgress color="secondary" />;
  if (user) {
    const openMenu = (event) => setAnchor(event.currentTarget);
    return (
      <>
        <Button className={classes.link} onClick={openMenu}>{user.displayName}</Button>
        <Menu
          keepMounted
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setAnchor(null)}
        >
          <MenuItem onClick={auth().signOut}>Выйти</MenuItem>
        </Menu>
      </>
    );
  }
  return (
    <Link to="/signIn" className={classes.link}>
      <Button color="inherit">
      Войти
      </Button>
    </Link>
  );
};
