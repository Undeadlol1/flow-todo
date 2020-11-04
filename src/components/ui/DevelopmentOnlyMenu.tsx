import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BuildIcon from '@material-ui/icons/Build';
import { makeStyles } from '@material-ui/styles';
import get from 'lodash/get';
import random from 'lodash/random';
import { loremIpsum } from 'lorem-ipsum';
import React, { memo, MouseEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { getUniqueId } from '../../helpers/getUniqueId';
import LevelingService from '../../services/leveling';
import {
  addPoints,
  addPointsWithSideEffects,
  Profile,
} from '../../store/index';
import { createTask } from "../../repositories/createTask";
import { authSelector, profileSelector } from '../../store/selectors';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    left: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

function DevelopmentOnlyMenu() {
  const cx = useStyles();
  const firestore = useFirestore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event!.currentTarget);
  };

  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  function addTask() {
    const taskId = getUniqueId();
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
          id: getUniqueId(),
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
      .doc(`profiles/${auth.uid}`)
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
  return (
    <Box>
      <Fab className={cx.root} onClick={toggleMenu}>
        <BuildIcon />
      </Fab>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={toggleMenu}
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
}

DevelopmentOnlyMenu.displayName = 'DevelopmentOnlyMenu';

export default memo(DevelopmentOnlyMenu);
