import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
} from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmailIcon from '@material-ui/icons/Email';
import ExitIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import ShareIcon from '@material-ui/icons/Share';
import TelegramIcon from '@material-ui/icons/Telegram';
import { makeStyles, withStyles } from '@material-ui/styles';
import debug from 'debug';
import get from 'lodash/get';
import React, { memo } from 'react';
import { When } from 'react-if';
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
const useStyles = makeStyles((theme: Theme) => ({
  link: {
    width: '100%',
    color: 'inherit',
    textDecoration: 'none',
  },
  mailto: {
    color: 'inherit',
    textDecoration: 'none',
  },
  backgroundColor: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const StyledListText = withStyles({
  root: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})(ListItemText);

const Sidebar: React.FC<{
  isOpen: boolean;
  isLoggedIn: boolean;
}> = ({ isLoggedIn, isOpen }) => {
  const cx = useStyles();
  const history = useHistory();
  const t = useTypedTranslate();
  log('isLoggedIn: ', isLoggedIn);
  log('isOpen: ', isOpen);

  const { share, isSupported: isShareSupported } = useWebShare(
    toggleSidebar,
    // @ts-ignore
    handleErrors,
  );

  function logoutOrRedirect() {
    toggleSidebar();
    if (!isLoggedIn) history.push('/signin');
    else {
      localStorage.removeItem('userId');
      getFirebase()
        .logout()
        .catch(handleErrors);
    }
  }

  function shareMainPage() {
    share({
      title: 'Долгий Ящик',
      text: t('gamified todo list'),
      url: get(window, 'location.origin'),
    });
  }

  function redirectAndCloseSidebar(url: string) {
    return () => {
      history.push(url);
      toggleSidebar();
    };
  }

  return (
    <Drawer
      open={isOpen}
      anchor="bottom"
      classes={{ paper: cx.backgroundColor }}
      onClose={toggleSidebar}
    >
      <List>
        <ListItem button onClick={redirectAndCloseSidebar('/faq')}>
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
          <StyledListText primary={t('telegram_group')} />
        </ListItem>
        <When condition={isShareSupported}>
          <ListItem button onClick={shareMainPage}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <StyledListText primary={t('share')} />
          </ListItem>
        </When>
        <MailTo secure className={cx.mailto} to="paleyblog@gmail.com">
          <ListItem button>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <StyledListText primary={t('feedback')} />
          </ListItem>
        </MailTo>
        <ListItem button onClick={logoutOrRedirect}>
          <ListItemIcon>
            {isLoggedIn ? <AccountBoxIcon /> : <ExitIcon />}
          </ListItemIcon>
          <StyledListText
            primary={t(isLoggedIn ? 'log out' : 'log in')}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
