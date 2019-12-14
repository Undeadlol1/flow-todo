import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Unless } from 'react-if';
import MailTo from 'react-mailto.js';
import { useDispatch } from 'react-redux';
import { getFirebase } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import {
  handleErrors,
  useTypedTranslate,
} from '../../services/index';
import { useTypedSelector } from '../../store/index';
import { toggleSidebar } from '../../store/uiSlice';

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
  const isAnonymous = useTypedSelector(s =>
    get(s, 'firebase.auth.isAnonymous'),
  );
  function logoutIfNeeded() {
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
