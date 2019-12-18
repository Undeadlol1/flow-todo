import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import clsx from 'clsx';
import { firestore } from 'firebase/app';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import random from 'lodash/random';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Else, If, Then } from 'react-if';
import { Link } from 'react-router-dom';
import { useFirestore } from 'react-redux-firebase';
import { Task, useTypedSelector } from '../../../store/index';
import { useSelector } from 'react-redux';
import {
  activeTasksSelector,
  uiSelector,
} from '../../../store/selectors';

const useStyles = makeStyles({
  paper: {
    padding: '100px',
  },
  buttonRoot: {
    padding: 0,
    textAlign: 'center',
  },
});

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
  const [t] = useTranslation();

  const docs = tasks || [];
  const firestore = useFirestore();
  const activeTaskId = get(docs.find(i => i.isCurrent), 'id');
  // TODO make this a service (TaskPageContainer has similar funcitonality)
  // TODO exclude activeTaskId from from next line
  const randomTaskId = get(docs, `[${random(docs.length - 1)}].id`);
  // TODO: move logic into a service?
  if (
    !isEmpty(docs) &&
    !activeTaskId &&
    !isAppTourActive &&
    randomTaskId
  ) {
    firestore
      .doc('tasks/' + randomTaskId)
      .update({ isCurrent: true });
  }

  const buttonText = t(
    activeTaskId || isAppTourActive ? 'start' : 'noTasks',
  );
  const isDisabled = loading || get(tasks, 'empty') || !activeTaskId;
  const linkPath = `/tasks/${
    isAppTourActive ? 'introExample' : activeTaskId
  }`;

  return (
    <Button
      to={linkPath}
      color="primary"
      disabled={isDisabled}
      component={isDisabled ? 'div' : Link}
      classes={{ root: classes.buttonRoot }}
      className={clsx(['RandomTaskButton', className])}
    >
      <Paper elevation={6} className={classes.paper}>
        <If condition={loading}>
          <Then>
            <CircularProgress />
          </Then>
          <Else>
            <Zoom in>
              <Typography>{buttonText}</Typography>
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
  const tasks = useSelector(activeTasksSelector);
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
