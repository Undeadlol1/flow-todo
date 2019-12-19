import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import BuildIcon from '@material-ui/icons/Build';
import get from 'lodash/get';
import random from 'lodash/random';
import { loremIpsum } from 'lorem-ipsum';
import React, { MouseEvent, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import {
  calculatePointsToNextLevel,
  calculateUserLevel,
} from '../../services/index';
import {
  addPoints,
  addPointsWithSideEffects,
  upsertTask,
  useTypedSelector,
} from '../../store/index';
import { authSelector, profileSelector } from '../../store/selectors';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    left: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

const DevelopmentOnlyMenu: React.FC<{}> = () => {
  const cx = useStyles();
  const firestore = useFirestore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event!.currentTarget);
  };

  const auth = useTypedSelector(authSelector);
  const profile = useTypedSelector(profileSelector);

  function createTask() {
    upsertTask({
      userId: auth.uid,
      name: loremIpsum({
        count: 4,
        units: 'words',
      }),
      tags: loremIpsum({
        count: 3,
        units: 'word',
      }).split(' '),
    });
  }

  function levelUp() {
    const level = calculateUserLevel(get(profile, 'points', 0));
    const pointsToNextLevel = calculatePointsToNextLevel(level);
    addPoints(auth.uid, pointsToNextLevel);
  }

  function resetPoints() {
    firestore.doc('profiles/' + auth.uid).update({ points: 0 });
  }

  function createAReward() {
    firestore.collection('rewards').add({
      userId: auth.uid,
      name: loremIpsum({ count: random(1, 5), units: 'words' }),
      points: random(0, 100),
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
          <MenuItem
            onClick={() => addPointsWithSideEffects(auth.uid, 50)}
          >
            Add 50 points
          </MenuItem>
          <MenuItem onClick={resetPoints}>Reset points</MenuItem>
          <MenuItem onClick={levelUp}>Level up</MenuItem>
          <MenuItem onClick={createAReward}>Add a reward</MenuItem>
          <MenuItem onClick={createTask}>Add a task</MenuItem>
        </Menu>
      </Box>
    );
};

export default React.memo(DevelopmentOnlyMenu);
