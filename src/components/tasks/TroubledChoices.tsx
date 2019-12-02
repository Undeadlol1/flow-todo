import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import addHours from 'date-fns/addHours';
import Slide from '@material-ui/core/Slide';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import {
  updateTaskParams,
  deleteTaskArguments,
} from '../../pages/TaskPage/TaskPageContainer';

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

const TroublesChoices = ({
  updateTask,
  deleteTask,
}: {
  deleteTask: (options?: deleteTaskArguments) => Promise<void>;
  updateTask: (options: updateTaskParams) => Promise<void>;
}) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { pathname } = useLocation();
  const commonButtonProps: ButtonProps = {
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
    className: classes.button,
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
      pointsToAdd: 0,
    });
  }
  function destroy() {
    const pointsToAdd = 10;
    deleteTask({
      pointsToAdd,
      snackbarMessage: t('getRidOfUnimportant', {
        points: pointsToAdd,
      }),
    });
  }
  return (
    <Grid
      item
      container
      xs={12}
      sm={8}
      md={6}
      lg={5}
      direction="row"
      justify="center"
      alignContent="space-around"
      className={classes.container}
    >
      <Slide in direction="left">
        <Box textAlign="center" width="100%">
          <Grid item xs={12}>
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
            <Button {...commonButtonProps} onClick={destroy}>
              {t('notImportant')}
            </Button>
          </Grid>
          {/* NOTE: WIP */}
          {/* <Grid item xs={12}>
            <Button {...commonButtonProps} disabled>
              {t('dont want to')}
            </Button>
          </Grid> */}
          <Grid item xs={12}>
            <Button {...commonButtonProps} onClick={postPone}>
              {t('cant right now')}
            </Button>
          </Grid>
        </Box>
      </Slide>
    </Grid>
  );
};

export default TroublesChoices;
