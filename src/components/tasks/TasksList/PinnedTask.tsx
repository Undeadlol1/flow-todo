import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import {
  handleErrors,
  showSnackbar,
  useTypedTranslate,
} from '../../../services/index';
import { addPointsWithSideEffects } from '../../../store/index';
import {
  authSelector,
  pinnedTaskSelector,
} from '../../../store/selectors';
import CreateSubtask from '../CreateSubtask/CreateSubtask';
import SubtasksList from '../SubtasksList';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';

let taskId = '';
const log = debug('Pinnedtask');

export default memo(function PinnedTask() {
  const t = useTypedTranslate();
  const auth = useSelector(authSelector);
  const task = useSelector(pinnedTaskSelector);
  const taskRef = useFirestore().doc('tasks/' + task.id || taskId);
  log('task: ', task);
  log('taskId: ', taskId);
  if (isEmpty(task)) return null;
  if (task && task.id) taskId = task.id;

  function done() {
    const points = 30;
    showSnackbar(t('goodJobPointsRecieved', { points }));
    Promise.all([
      addPointsWithSideEffects(auth.uid, points),
      taskRef.update({
        isDone: true,
        isPinned: false,
        doneAt: Date.now(),
      }),
    ]).catch(handleErrors);
  }

  function unpin() {
    taskRef
      .update({
        isPinned: false,
      })
      .catch(handleErrors);
  }

  return (
    <Card>
      <Link component={RouterLink} to={'tasks/' + taskId}>
        <CardHeader title={task.name} />
      </Link>
      <CardContent>
        <CreateSubtask taskId={taskId} />
        <SubtasksList documents={task.subtasks} />
      </CardContent>
      <CardActions>
        <Tooltip title={t('done task')}>
          <IconButton aria-label={t('done task')} onClick={done}>
            <DoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('unpin')}>
          <IconButton aria-label={t('unpin')} onClick={unpin}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
});
