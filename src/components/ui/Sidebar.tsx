import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Unless, When } from 'react-if';
import MailTo from 'react-mailto.js';
import { useDispatch } from 'react-redux';
import { getFirebase } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import useWebShare from 'react-use-web-share';
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
  upperCase: {
    textTransform: 'uppercase',
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
  const { share, isSupported: isShareSupported } = useWebShare(
    function onSuccess() {
      dispatch(toggleSidebar());
    },
    // @ts-ignore
    function onFailure(error) {
      handleErrors(error);
    },
  );

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

  function shareMainPage() {
    share({
      title: 'Flow TODO',
      text: 'Геймифицированный задачник',
      url: get(window, 'location.origin'),
    });
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
            history.push('/rewards');
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
        <When condition={isShareSupported}>
          <ListItem button onClick={shareMainPage}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('share')}
              className={cx.upperCase}
            />
          </ListItem>
        </When>
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
