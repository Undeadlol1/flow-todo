import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import BuildIcon from '@material-ui/icons/Build';
import { UserInfo } from 'firebase';
import get from 'lodash/get';
import random from 'lodash/random';
import { loremIpsum } from 'lorem-ipsum';
import React, { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import {
  calculatePointsToNextLevel,
  calculateUserLevel,
  getNewlyUnlockedReward,
  showLevelUpAnimation,
  willUserLevelUp,
} from '../../services/index';
import {
  addPoints,
  Profile,
  upsertTask,
  useTypedSelector,
} from '../../store/index';
import { Reward } from '../../store/rewardsSlice';
import { toggleRewardModal } from '../../store/uiSlice';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    left: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

const DevelopmentOnlyMenu: React.FC<{}> = () => {
  const cx = useStyles();
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event!.currentTarget);
  };

  const auth: UserInfo = useSelector(s => get(s, 'firebase.auth'));
  const profile = useTypedSelector(
    s => s.firestore.data.profile as Profile,
  );
  const profilePoints = get(profile, 'points', 0);
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );

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

  function addUserPoints() {
    const pointToAdd = 50;
    const nextReward = getNewlyUnlockedReward(
      profilePoints,
      pointToAdd,
      rewards,
    );
    addPoints(auth.uid, pointToAdd);
    if (willUserLevelUp(profilePoints, pointToAdd))
      showLevelUpAnimation();
    // TODO refactor
    if (nextReward) dispatch(toggleRewardModal());
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
          <MenuItem onClick={addUserPoints}>Add 50 points</MenuItem>
          <MenuItem onClick={resetPoints}>Reset points</MenuItem>
          <MenuItem onClick={levelUp}>Level up</MenuItem>
          <MenuItem onClick={createAReward}>Add a reward</MenuItem>
          <MenuItem onClick={createTask}>Add a task</MenuItem>
        </Menu>
      </Box>
    );
};

export default React.memo(DevelopmentOnlyMenu);
