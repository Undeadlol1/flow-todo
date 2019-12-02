import React, { useState, MouseEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BuildIcon from '@material-ui/icons/Build';
import { upsertTask } from '../../store/index';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { UserInfo } from 'firebase';
import { loremIpsum } from 'lorem-ipsum';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    left: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

const DevelopmentOnlyMenu: React.FC<{}> = () => {
  const cx = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const auth: UserInfo = useSelector(s => get(s, 'firebase.auth'));

  function toggleMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(anchorEl ? null : event!.currentTarget);
  }

  function createRandomTask() {
    upsertTask({
      userId: auth.uid,
      name: loremIpsum({
        count: 4,
        units: 'words',
      }),
    });
  }

  if (process.env.NODE_ENV !== 'development') return null;
  else
    return (
      <Box>
        <Fab onClick={toggleMenu} className={cx.root}>
          <BuildIcon />
        </Fab>
        <Menu
          keepMounted
          onClose={toggleMenu}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
        >
          <MenuItem onClick={createRandomTask}>
            Add random task
          </MenuItem>
        </Menu>
      </Box>
    );
};

export default React.memo(DevelopmentOnlyMenu);
