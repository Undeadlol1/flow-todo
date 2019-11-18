import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { toggleAppTour } from '../../store/uiSlice';

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
  const dispatch = useDispatch();
  return (
    <Paper className={classes.container} elevation={6}>
      <img className={classes.image} src="/images/logo.png" alt="" />
      <Typography paragraph>
        Вы когда-нибудь откладывали задачи на потом и никогда не
        возвращались к ним?
      </Typography>
      <Typography paragraph>
        Когда-нибудь думали что "неплохо было бы сделать Х" и никогда
        не делали?
      </Typography>
      <Typography paragraph>
        Когда-нибудь оставляли задачи невыполненными потому что
        встретились с трудностями?
      </Typography>
      <Typography paragraph>
        Flow TODO - это приложение которое позволит справиться с этими
        проблемами с помощью трех простых шагов.
      </Typography>
      <Button
        className={classes.button}
        variant="outlined"
        onClick={() => dispatch(toggleAppTour())}
      >
        хотите узнать как?
      </Button>
    </Paper>
  );
};

export default WelcomeCard;
