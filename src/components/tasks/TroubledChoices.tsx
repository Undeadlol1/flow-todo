import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import addHours from 'date-fns/addHours';
import Slide from '@material-ui/core/Slide';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useScreenIsNarrow } from '../../services/index';
import { updateTaskParams } from '../../pages/TaskPage/TaskPageContainer';

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const TroublesChoices = ({
  updateTask,
  deleteTask,
}: {
  deleteTask: Function;
  updateTask: (options: updateTaskParams) => Promise<void>;
}) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { pathname } = useLocation();
  const isScreenNarrow = useScreenIsNarrow();
  const commonButtonProps: ButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
    fullWidth: isScreenNarrow,
  };
  function postPone() {
    updateTask({
      values: {
        isCurrent: false,
        dueAt: addHours(new Date(), 12).getTime(),
      },
      history: {
        createdAt: Date.now(),
        actionType: 'postpone',
      },
      snackbarMessage: t('Posponed until tomorrow'),
      snackbarVariant: 'default',
    });
  }
  return (
    <Slide in direction="left">
      <Grid
        container
        direction="row"
        alignContent="space-around"
        className={classes.container}
      >
        <Grid item xs={12} style={{ margin: '0 auto' }}>
          {/*
          // @ts-ignore */}
          <Button
            {...commonButtonProps}
            component={Link}
            to={`${pathname}/isHard`}
            color="secondary"
          >
            {t('hard')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            {...commonButtonProps}
            onClick={(e: React.SyntheticEvent) => deleteTask()}
          >
            {t('notImportant')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button {...commonButtonProps} disabled>
            {t('dont want to')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button {...commonButtonProps} onClick={postPone}>
            {t('cant right now')}
          </Button>
        </Grid>
      </Grid>
    </Slide>
  );
};

export default TroublesChoices;
