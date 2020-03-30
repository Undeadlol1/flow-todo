import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmailIcon from '@material-ui/icons/Email';
import ExitIcon from '@material-ui/icons/ExitToApp';
import GitftIcon from '@material-ui/icons/Redeem';
import ShareIcon from '@material-ui/icons/Share';
import HelpIcon from '@material-ui/icons/Help';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Unless, When } from 'react-if';
import MailTo from 'react-mailto.js';
import { getFirebase } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import useWebShare from 'react-use-web-share';
import {
  handleErrors,
  toggleSidebar,
  useTypedTranslate,
} from '../../services/index';
import { useTypedSelector } from '../../store/index';
import { authSelector, uiSelector } from '../../store/selectors';

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
  const { isSidebarOpen } = useTypedSelector(uiSelector);
  const { isAnonymous } = useTypedSelector(authSelector);
  log('isAnonymous: ', isAnonymous);
  log('isSidebarOpen: ', isSidebarOpen);

  const { share, isSupported: isShareSupported } = useWebShare(
    toggleSidebar,
    // @ts-ignore
    handleErrors,
  );

  function logoutOrRedirect() {
    toggleSidebar();
    if (isAnonymous) history.push('/signin');
    else
      getFirebase()
        .logout()
        .catch(handleErrors);
  }

  function shareMainPage() {
    share({
      title: 'Flow TODO',
      text: t('gamified todo list'),
      url: get(window, 'location.origin'),
    });
  }

  return (
    <Drawer open={isSidebarOpen} onClose={toggleSidebar}>
      <List className={cx.list}>
        <ListItem
          button
          onClick={() => {
            history.push('/rewards');
            toggleSidebar();
          }}
        >
          <ListItemIcon>
            <GitftIcon />
          </ListItemIcon>
          <StyledListText primary={t('rewards')} />
        </ListItem>
        <MailTo className={cx.mailto} secure to="paleyblog@gmail.com">
          <ListItem button>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <StyledListText primary={t('feedback')} />
          </ListItem>
        </MailTo>
        <When condition={isShareSupported}>
          <ListItem button onClick={shareMainPage}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <StyledListText primary={t('share')} />
          </ListItem>
        </When>
        <ListItem
          button
          onClick={() => {
            history.push('/faq');
            toggleSidebar();
          }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          {/* TODO: add translations */}
          <StyledListText primary={t('faq')} />
        </ListItem>
        <Unless condition={isUndefined(isAnonymous)}>
          <ListItem button onClick={logoutOrRedirect}>
            <ListItemIcon>
              {isAnonymous ? <AccountBoxIcon /> : <ExitIcon />}
            </ListItemIcon>
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
