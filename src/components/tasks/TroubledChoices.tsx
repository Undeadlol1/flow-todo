import React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import addHours from 'date-fns/addHours';
import Slide from '@material-ui/core/Slide';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useScreenIsNarrow } from '../../services/index';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const TroublesChoices = ({
  updateTask,
  deleteTask,
}: {
  updateTask: Function;
  deleteTask: Function;
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
    updateTask(
      { isCurrent: false, dueAt: addHours(new Date(), 12).getTime() },
      t('Posponed until tomorrow'),
      'default',
      0,
    );
  }
  return (
    <Slide in direction="left">
      <Grid component={Box} container textAlign="center">
        <Grid item xs={12}>
          {/*
          // @ts-ignore */}
          <Button
            {...commonButtonProps}
            component={Link}
            to={`${pathname}/isHard`}
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

TroublesChoices.propTypes = {
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TroublesChoices;
