import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(1),
  },
  button: {
    display: 'block',
    margin: '0 auto',
  },
}));

const HardChoices = (props: {
  taskId: string;
  task: { subtasks: any };
}) => {
  const [t] = useTranslation();
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Button className={classes.button} disabled>
          {t('Rework task')}
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <CreateSubtask
          taskId={props.taskId}
          className={classes.form}
        />
        <SubtasksList documents={props.task.subtasks} />
      </Grid>
    </>
  );
};

export default HardChoices;
