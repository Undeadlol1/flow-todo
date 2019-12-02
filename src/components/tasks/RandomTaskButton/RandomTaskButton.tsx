import React, { useContext, memo } from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import get from 'lodash/get';
import random from 'lodash/random';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import { If, Then, Else } from 'react-if';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TasksContext } from '../../../store/contexts';
import { firestore } from 'firebase/app';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import find from 'ramda/src/find';
import { useTypedSelector, upsertTask } from '../../../store/index';
import isEmpty from 'lodash/isEmpty';

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
  tasks?: firestore.QuerySnapshot;
  loading: boolean;
  className?: string;
}

export const RandomTaskButton = ({
  tasks,
  loading,
  className,
}: Props) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { isAppTourActive } = useTypedSelector(s => s.ui);

  const docs = get(tasks, 'docs', []);
  const activeTaskId = compose(
    // @ts-ignore
    prop('id'),
    find((i: firestore.DocumentData) => i.get('isCurrent') === true),
  )(docs);
  // TODO: move logic into a service?
  if (!isEmpty(docs) && !activeTaskId && !isAppTourActive) {
    upsertTask(
      { isCurrent: true },
      get(docs, `[${random(docs.length - 1)}].id`),
    );
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
  const { tasks, loading } = useContext(TasksContext);

  return (
    <RandomTaskButton
      {...{
        ...props,
        tasks: tasks,
        loading: Boolean(loading),
      }}
    />
  );
});
