import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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
import { useTypedSelector } from '../../../store/index';

const useStyles = makeStyles({
  paper: {
    padding: '100px',
  },
});

interface Props {
  tasks?: firestore.QuerySnapshot;
  // tasks: {
  //   empty: boolean;
  //   docs?: ITask[];
  // };
  loading: boolean;
  className?: string;
}

export function RandomTaskButton({
  tasks,
  loading,
  className,
}: Props) {
  const classes = useStyles();
  const [t] = useTranslation();

  const { isAppTourActive } = useTypedSelector(s => s.ui);

  const docs = get(tasks, 'docs', []);
  const docsCount = docs.length;
  const randomTaskId = isAppTourActive
    ? '/tasks/introExample'
    : get(docs, `[${[random(docsCount - 1)]}].id`);
  const buttonText = t(randomTaskId ? 'start' : 'noTasks');
  const isDisabled = loading || tasks.empty || !randomTaskId;

  return (
    <Button
      color="primary"
      className={clsx(['RandomTaskButton', className])}
      disabled={isDisabled}
      to={`/tasks/${randomTaskId}`}
      component={isDisabled ? 'div' : Link}
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
}

RandomTaskButton.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  tasks: PropTypes.object.isRequired,
};

interface ContainerProps {
  className?: string;
  tasks: firestore.QuerySnapshot;
}

export default function RandomTaskButtonContainer(
  props: ContainerProps,
) {
  const { tasks, loading } = useContext(TasksContext);

  return (
    <RandomTaskButton
      {...{
        ...props,
        loading,
        tasks: tasks,
      }}
    />
  );
}
