import React from 'react';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { useDispatch } from 'react-redux';
// import { toggleAppTour } from '../../store/uiSlice';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
  },
  image: {
    margin: '0 auto',
    display: 'block',
    paddingBottom: theme.spacing(3),
  },
  button: {
    margin: '0 auto',
    display: 'block',
  },
}));

interface Props {}

const WelcomeCard: React.FC<Props> = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.container} elevation={6}>
      <img className={classes.image} src="/images/logo.png" alt="" />
      {/* TODO: i18n */}
      <Typography paragraph>
        <b>Долгий ящик</b> - приложение помогающее справиться с
        задачами которые ты вечно откладываешь
      </Typography>
      <Typography paragraph>
        Просто добавь пару задач и смотри как приложение с помощью
        психологических трюков облегчает задачи и позволяет сдвинуться
        с мертвой точки
      </Typography>
      {/* WIP */}
      {/* <Typography paragraph>
        Долгий Ящик - это приложение которое позволит справиться с этими
        проблемами с помощью трех простых шагов.
      </Typography>
      <Button
        className={classes.button}
        variant="outlined"
        onClick={() => dispatch(toggleAppTour())}
      >
        хотите узнать как?
      </Button> */}
    </Paper>
  );
};

export default WelcomeCard;
