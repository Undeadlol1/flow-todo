import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
  return (
    <Paper className={classes.container} elevation={6}>
      <img className={classes.image} src="/images/logo.png" alt="" />
      {/* TODO: i18n */}
      <Typography paragraph>
        Это приложение поможет справиться с задачами, которые ты вечно
        откладываешь в <b>долгий ящик</b>.
      </Typography>
      <Typography paragraph>
        Просто добавь пару задач и смотри, как приложение с помощью
        психологических трюков облегчает их и позволяет сдвинуться с
        мертвой точки.
      </Typography>
    </Paper>
  );
};

export default WelcomeCard;
