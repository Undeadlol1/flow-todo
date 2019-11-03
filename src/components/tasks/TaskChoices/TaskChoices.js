import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
    Switch,
    Route,
    Link,
    useLocation,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';

const HardChoices = ({ postponeTask }) => {
    const { pathname } = useLocation();
    return (
      <Grid container direction="column">
        <Grid item xs align="center">
          <Button component={Link} to={`${pathname}/hard`}>
            Тяжело
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button component={Link} to={`${pathname}/hard`}>
            Я не знаю деталей
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button>Не хочу</Button>
        </Grid>
        <Grid item xs align="center">
          <Button onClick={postponeTask}>Не могу сейчас</Button>
        </Grid>
      </Grid>
    );
};

HardChoices.propTypes = {
    postponeTask: PropTypes.func.isRequired,
};

const TaskActions = () => {
    const { pathname } = useLocation();
    return (
      <Grid container direction="column">
        <Grid item xs align="center">
          <Button component={Link} to={`${pathname}/hard`}>
                    Есть трудности
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button>Сделал шаг вперед</Button>
        </Grid>
        <Grid item xs align="center">
          <Button>Сильно продвинулся</Button>
        </Grid>
      </Grid>
    );
};

export default props => (
  <Switch>
    <Route path={`${props.path}/hard`}>
      <HardChoices {...props} />
    </Route>
    <Route path={props.path}>
      <TaskActions {...props} />
    </Route>
  </Switch>
);
