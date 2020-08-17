import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';
import BuildIcon from '@material-ui/icons/Build';
import get from 'lodash/get';
import random from 'lodash/random';
import { loremIpsum } from 'lorem-ipsum';
import nanoid from 'nanoid';
import React, { MouseEvent, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import LevelingService from '../../services/leveling';
import {
  addPoints,
  addPointsWithSideEffects,
  createTask,
  Profile,
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

  function addTask() {
    const taskId = nanoid();
    createTask({
      id: taskId,
      userId: auth.uid,
      name: loremIpsum({
        count: 4,
        units: 'words',
      }),
      tags: loremIpsum({
        count: 3,
        units: 'word',
      }).split(' '),
      subtasks: Array(random(5))
        .fill('')
        .map(() => ({
          id: nanoid(),
          name: loremIpsum({
            count: 4,
            units: 'words',
          }),
          isDone: false,
          parentId: taskId,
          createdAt: Date.now(),
        })),
    });
  }

  function levelUp() {
    const level = LevelingService.calculateUserLevel(
      get(profile, 'points', 0),
    );
    const pointsToNextLevel = LevelingService.calculatePointsToNextLevel(
      level,
    );
    addPoints(auth.uid, pointsToNextLevel);
  }

  function resetLevel() {
    firestore
      .doc('profiles/' + auth.uid)
      .update({ points: 0, experience: 0 } as Profile);
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
          <MenuItem onClick={resetLevel}>Reset level</MenuItem>
          <MenuItem onClick={levelUp}>Level up</MenuItem>
          <MenuItem onClick={createAReward}>Add a reward</MenuItem>
          <MenuItem onClick={addTask}>Add a task</MenuItem>
        </Menu>
      </Box>
    );
};

export default React.memo(DevelopmentOnlyMenu);
