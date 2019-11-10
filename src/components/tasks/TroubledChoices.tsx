import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import addHours from 'date-fns/addHours';
import Slide from '@material-ui/core/Slide';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const TroublesChoices = ({
  updateTask,
}: {
  updateTask: Function;
}) => {
  const [t] = useTranslation();
  const { pathname } = useLocation();
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
          <Button component={Link} to={`${pathname}/isHard`}>
            {t('hard')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button disabled>{t('dont want to')}</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={postPone}>{t('cant right now')}</Button>
        </Grid>
      </div>
    </Slide>
  );
};

TroublesChoices.propTypes = {
  updateTask: PropTypes.func.isRequired,
};

export default TroublesChoices;
