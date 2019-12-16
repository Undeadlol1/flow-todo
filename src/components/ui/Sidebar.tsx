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
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const t = useTypedTranslate();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useTypedSelector(s => s.ui);
  const { isAnonymous } = useTypedSelector(s =>
    get(s, 'firebase.auth'),
  );
  log('isAnonymous: ', isAnonymous);
  log('isSidebarOpen: ', isSidebarOpen);

  function logoutOrRedirect() {
    dispatch(toggleSidebar());
    if (isAnonymous) history.push('/signin');
    else
      getFirebase()
        .logout()
        .catch(handleErrors);
  }

  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => dispatch(toggleSidebar())}
    >
      <List className={cx.list}>
        <ListItem
          button
          onClick={() => {
            history.push('rewards');
            dispatch(toggleSidebar());
          }}
        >
          <StyledListText primary={t('rewards')} />
        </ListItem>
        <MailTo className={cx.mailto} secure to="paleyblog@gmail.com">
          <ListItem button>
            <StyledListText primary={t('feedback')} />
          </ListItem>
        </MailTo>
        <Unless condition={isUndefined(isAnonymous)}>
          <ListItem button onClick={logoutOrRedirect}>
            <StyledListText
              primary={t(isAnonymous ? 'log in' : 'log out')}
            />
          </ListItem>
        </Unless>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
