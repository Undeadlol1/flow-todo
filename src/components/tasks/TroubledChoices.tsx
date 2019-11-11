import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import addHours from 'date-fns/addHours';
import Slide from '@material-ui/core/Slide';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const TroublesChoices = ({
  updateTask,
}: {
  updateTask: Function;
}) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { pathname } = useLocation();
  const commonButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
  };
  function postPone() {
    updateTask(
      { dueAt: addHours(new Date(), 16).getTime() },
      t('Posponed until tomorrow'),
      'default',
    );
  }
  return (
    <Slide in direction="left">
      <div style={{ textAlign: 'center' }}>
        <Grid item xs={12}>
          <Button
            component={Link}
            to={`${pathname}/isHard`}
            color="primary"
            variant="contained"
            className={classes.button}
          >
            {t('hard')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled
          >
            {t('dont want to')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={postPone}
          >
            {t('cant right now')}
          </Button>
        </Grid>
      </div>
    </Slide>
  );
};

TroublesChoices.propTypes = {
  updateTask: PropTypes.func.isRequired,
};

export default TroublesChoices;
