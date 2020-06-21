import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
import debug from 'debug';
import { firestore } from 'firebase/app';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import random from 'lodash/random';
import React, { memo } from 'react';
import { Else, If, Then } from 'react-if';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { useScreenIsNarrow } from '../../../services/index';
import { Task, useTypedSelector } from '../../../store/index';
import {
  activeTaskSelector,
  tasksSelector,
  uiSelector,
} from '../../../store/selectors';

const log = debug('RandomTaskButton');
debug.enable('RandomTaskButton');

const useStyles = makeStyles(theme => ({
  paper: {
    color: theme.palette.secondary.contrastText,
    padding: '100px',
    backgroundColor: theme.palette.primary.main,
  },
  buttonRoot: {
    padding: 0,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
}));

interface Props {
  tasks?: Task[];
  loading: boolean;
  className?: string;
  isAppTourActive: boolean;
}

export const RandomTaskButton = ({
  tasks,
  loading,
  className,
  isAppTourActive,
}: Props) => {
  const classes = useStyles();
  const isScreenNarrow = useScreenIsNarrow();

  const docs = tasks || [];
  const firestore = useFirestore();
  const currentTasks = useSelector(tasksSelector);
  const currentTaskId = get(useSelector(activeTaskSelector), 'id');
  // TODO make this a service (TaskPageContainer has similar funcitonality)
  // TODO exclude activeTaskId from from next line
  const randomTaskId = get(docs, `[${random(docs.length - 1)}].id`);
  // TODO: move logic into a service?
  if (
    !isEmpty(docs) &&
    !currentTaskId &&
    !isAppTourActive &&
    randomTaskId
  ) {
    firestore
      .doc('tasks/' + randomTaskId)
      .update({ isCurrent: true });
  }

  // const buttonText = t(
  //   currentTaskId || isAppTourActive ? 'start' : 'noTasks',
  // );
  const buttonText = `Задач: ${currentTasks && currentTasks.length}`;
  const isDisabled = loading || get(tasks, 'empty') || !currentTaskId;
  const linkPath = `/tasks/${
    isAppTourActive ? 'introExample' : currentTaskId
  }`;
  log('isDisabled: ', isDisabled);
  log('linkPath: ', linkPath);

  return (
    <Button
      to={linkPath}
      // color="primary"
      disabled={isDisabled}
      component={isDisabled ? 'div' : Link}
      classes={{ root: classes.buttonRoot }}
      className={clsx([
        'RandomTaskButton',
        className,
        isScreenNarrow && classes.fullWidth,
      ])}
    >
      <Paper
        // elevation={6}
        className={clsx(classes.paper, {
          [classes.fullWidth]: isScreenNarrow,
        })}
      >
        <If condition={loading}>
          <Then>
            <CircularProgress />
          </Then>
          <Else>
            <Zoom in>
              <Typography variant="h6">{buttonText}</Typography>
            </Zoom>
          </Else>
        </If>
      </Paper>
    </Button>
  );
};

interface ContainerProps {
  className?: string;
  tasks?: firestore.QuerySnapshot;
}

export default memo(function RandomTaskButtonContainer(
  props: ContainerProps,
) {
  const tasks = useSelector(tasksSelector);
  const { isAppTourActive } = useTypedSelector(uiSelector);

  return (
    <RandomTaskButton
      {...{
        ...props,
        isAppTourActive,
        tasks: tasks,
        loading: isUndefined(tasks),
      }}
    />
  );
});
