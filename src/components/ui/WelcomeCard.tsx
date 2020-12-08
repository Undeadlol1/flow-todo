import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useTypedTranslate } from '../../services';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  image: {
    width: '100%',
    margin: '0 auto',
    display: 'block',
    paddingBottom: theme.spacing(3),
  },
}));

const WelcomeCard: React.FC<{}> = () => {
  const classes = useStyles();
  const t = useTypedTranslate();
  return (
    <Paper className={classes.container} elevation={6}>
      <Grid container justify="center">
        <Grid item xs={7} sm={6} md={6} lg={6}>
          <img
            className={classes.image}
            src="/images/logo.png"
            alt=""
          />
        </Grid>
      </Grid>
      <Typography paragraph>
        {t('this_app_will_allow_help_you_with_tasks')}
      </Typography>
      <Typography paragraph>
        {t('simply_add_few_tasks_and_watch')}
      </Typography>
    </Paper>
  );
};

export default WelcomeCard;
