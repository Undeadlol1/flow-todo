import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import addHours from 'date-fns/addHours';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TaskPageGridWidth } from '../../pages/TaskPage';
import { useTypedTranslate } from '../../services/index';
import {
  deleteTaskArguments,
  updateTaskParams,
} from '../../pages/TaskPage/TaskPageContainer';
import Typography from '@material-ui/core/Typography';

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
  const t = useTypedTranslate();
  const { pathname } = useLocation();
  const commonButtonProps: ButtonProps = {
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
    className: classes.button,
  };
  function postPone(reason = '') {
    updateTask({
      pointsToAdd: 0,
      snackbarMessage: reason
        ? t('dont do things you dont want')
        : t('Posponed until tomorrow'),
      values: {
        isCurrent: false,
        dueAt: addHours(new Date(), 12).getTime(),
      },
      history: {
        createdAt: Date.now(),
        actionType: 'postpone',
        comment: reason,
      },
    });
  }
  // function dontWantTo() {
  //   const reason = prompt(t('provide reason'));
  //   if (reason) postPone(reason);
  // }
  function destroy() {
    deleteTask({
      pointsToAdd: 10,
      snackbarMessage: t('getRidOfUnimportant', { points: 10 }),
    });
  }
  return (
    <Grid
      item
      container
      direction="row"
      justify="center"
      alignContent="space-around"
      className={classes.container}
      {...TaskPageGridWidth}
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
            <Typography paragraph>
              {/* TODO: i18n */}
              Не стесняйтесь жать эту кнопку.
            </Typography>
            <Typography paragraph>
              {/* TODO: i18n */}
              Лишь 20% усилий дают 80% результата.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button {...commonButtonProps} onClick={destroy}>
              {t('notImportant')}
            </Button>
          </Grid>
          {/* <Grid item xs={12}>
            <Button {...commonButtonProps} onClick={dontWantTo}>
              {t('dont want to')}
            </Button>
          </Grid> */}
          <Grid item xs={12}>
            <Button {...commonButtonProps} onClick={() => postPone()}>
              {t('cant right now')}
            </Button>
          </Grid>
        </Box>
      </Slide>
    </Grid>
  );
};

export default TroublesChoices;
