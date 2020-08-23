import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmailIcon from '@material-ui/icons/Email';
import ExitIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import ShareIcon from '@material-ui/icons/Share';
import TelegramIcon from '@material-ui/icons/Telegram';
import ViewListIcon from '@material-ui/icons/ViewList';
import { makeStyles, withStyles } from '@material-ui/styles';
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

const Sidebar: React.FC<{
  isOpen: boolean;
  isAnonymous: boolean;
  isTasksListEmpty: boolean;
}> = ({ isAnonymous, isOpen, isTasksListEmpty }) => {
  const cx = useStyles();
  const history = useHistory();
  const t = useTypedTranslate();
  log('isAnonymous: ', isAnonymous);
  log('isOpen: ', isOpen);

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
      title: 'Долгий Ящик',
      text: t('gamified todo list'),
      url: get(window, 'location.origin'),
    });
  }

  return (
    <Drawer open={isOpen} onClose={toggleSidebar}>
      <List className={cx.list}>
        <When condition={!isTasksListEmpty}>
          <ListItem
            button
            onClick={() => {
              history.push('/tasks');
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <StyledListText primary={t('tasks list')} />
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
          <StyledListText primary={t('faq')} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            window.location.href =
              'https://t.me/joinchat/G46MVRxzggOOlOfVfjqVrA';
          }}
        >
          <ListItemIcon>
            <TelegramIcon />
          </ListItemIcon>
          {/* TODO: i18n */}
          <StyledListText primary="Группа в Телеграмме" />
        </ListItem>
        <When condition={isShareSupported}>
          <ListItem button onClick={shareMainPage}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <StyledListText primary={t('share')} />
          </ListItem>
        </When>
        <MailTo className={cx.mailto} secure to="paleyblog@gmail.com">
          <ListItem button>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <StyledListText primary={t('feedback')} />
          </ListItem>
        </MailTo>
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
