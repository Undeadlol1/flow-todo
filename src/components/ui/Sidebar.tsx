import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import get from 'lodash/get';
import React, { memo } from 'react';
import MailTo from 'react-mailto.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  useTypedTranslate,
  handleErrors,
} from '../../services/index';
import { useTypedSelector } from '../../store/index';
import { toggleSidebar } from '../../store/uiSlice';
import { getFirebase } from 'react-redux-firebase';
import { auth } from 'firebase/app';
import { When, Unless } from 'react-if';
import isUndefined from 'lodash/isUndefined';

const log = debug('Sidebar');
const useStyles = makeStyles({
  link: {
    width: '100%',
    color: 'inherit',
    textDecoration: 'none',
  },
  list: {
    width: '250px',
  },
  mailto: {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const StyledListText = withStyles({
  root: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})(ListItemText);

const Sidebar: React.FC<{}> = () => {
  const cx = useStyles();
  const t = useTypedTranslate();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useTypedSelector(s => s.ui);
  // @ts-ignore
  const auth = useTypedSelector(s => s.firebase.auth);
  const isAnonymous = useTypedSelector(s =>
    get(s, 'firebase.auth.isAnonymous'),
  );
  function logoutIfNeeded() {
    console.log('logoutIfNeeded: ');
    if (!isAnonymous)
      getFirebase()
        .logout()
        .then(() => console.log('logged user out'))
        .catch(handleErrors);
  }
  log('isAnonymous: ', isAnonymous);
  log('isSidebarOpen: ', isSidebarOpen);
  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => dispatch(toggleSidebar())}
    >
      <List className={cx.list}>
        <ListItem button component={Link} to="/rewards">
          <StyledListText primary={t('rewards')} />
        </ListItem>
        <MailTo className={cx.mailto} secure to="paleyblog@gmail.com">
          <ListItem button>
            <StyledListText primary={t('feedback')} />
          </ListItem>
        </MailTo>
        <Unless condition={isUndefined(isAnonymous)}>
          <ListItem button onClick={logoutIfNeeded}>
            {isAnonymous ? (
              <Link to="/signin" className={cx.link}>
                <StyledListText primary={t('log in')} />
              </Link>
            ) : (
              <StyledListText primary={t('log out')} />
            )}
          </ListItem>
        </Unless>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
