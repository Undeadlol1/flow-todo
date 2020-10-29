import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
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
import { Theme } from '@material-ui/core';
import { Task, useTypedSelector } from '../../../store/index';
import {
  activeTaskSelector,
  tasksSelector,
  uiSelector,
} from '../../../store/selectors';

const useStyles = makeStyles((theme: Theme) => ({
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

  const docs = tasks || [];
  const firestore = useFirestore();
  const currentTasks = useSelector(tasksSelector);
  const currentTaskId = get(useSelector(activeTaskSelector), 'id');
  // TODO make this a service (TaskPageContainer has similar funcitonality)
  // TODO exclude activeTaskId from from next line
  const randomTaskId = get(docs, `[${random(docs.length - 1)}].id`);
  // TODO: move logic into a service?
  if (
    !isEmpty(docs)
    && !currentTaskId
    && !isAppTourActive
    && randomTaskId
  ) {
    firestore
      .doc(`tasks/${randomTaskId}`)
      .update({ isCurrent: true });
  }

  const buttonText = `Задач: ${currentTasks && currentTasks.length}`;
  const isDisabled = loading || get(tasks, 'empty') || !currentTaskId;
  const linkPath = `/tasks/${
    isAppTourActive ? 'introExample' : 'active'
  }`;

  return (
    <Button
      to={linkPath}
      disabled={isDisabled}
      component={isDisabled ? 'div' : Link}
      classes={{ root: classes.buttonRoot }}
      className={clsx(
        className,
        classes.fullWidth,
        'RandomTaskButton',
      )}
    >
      <Paper className={clsx(classes.paper, classes.fullWidth)}>
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

export default memo((
  props: ContainerProps,
) => {
  const tasks = useSelector(tasksSelector);
  const { isAppTourActive } = useTypedSelector(uiSelector);

  return (
    <RandomTaskButton
      {...{
        ...props,
        isAppTourActive,
        tasks,
        loading: isUndefined(tasks),
      }}
    />
  );
});
