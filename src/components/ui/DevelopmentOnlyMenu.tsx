import React, { useState, MouseEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BuildIcon from '@material-ui/icons/Build';

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

  function toggleMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(anchorEl ? null : event!.currentTarget);
  }

  if (process.env.NODE_ENV != 'development') return null;
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
          <MenuItem>This is a test</MenuItem>
        </Menu>
      </Box>
    );
};

export default DevelopmentOnlyMenu;
