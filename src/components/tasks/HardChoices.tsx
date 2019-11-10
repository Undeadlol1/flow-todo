import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Slide from '@material-ui/core/Slide';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';

const HardChoices = (props: {
  taskId: string;
  task: { subtasks: any };
}) => {
  const [t] = useTranslation();
  return (
    <Slide in direction="left">
      <div>
        <Grid item xs={12}>
          <Button>{t('Rework task')}</Button>
        </Grid>
        <Grid item xs={12}>
          <CreateSubtask taskId={props.taskId} />
        </Grid>
        <Grid item xs={12}>
          <SubtasksList documents={props.task.subtasks} />
        </Grid>
      </div>
    </Slide>
  );
};

export default HardChoices;
