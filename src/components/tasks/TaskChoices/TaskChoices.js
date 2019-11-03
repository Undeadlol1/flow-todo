import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';


const HardChoices = () => {
  const [t] = useTranslation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button>
          {/* TODO: add translations */}
          {t('Refactor')}
        </Button>
      </Grid>
      <Grid item xs align="center">
        <Button>
          {/* TODO: add translations */}
          {t('Add subtasks')}
        </Button>
      </Grid>
    </Grid>
  );
};

const TroublesChoices = ({ postponeTask }) => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/isHard`}>
          Тяжело
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

TroublesChoices.propTypes = {
  postponeTask: PropTypes.func.isRequired,
};

const TaskActions = () => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/isTroublesome`}>
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

export default props => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/isTroublesome/isHard`}>
        <HardChoices {...props} />
      </Route>
      <Route path={`${path}/isTroublesome`}>
        <TroublesChoices {...props} />
      </Route>
      <Route path={path}>
        <TaskActions {...props} />
      </Route>
    </Switch>
);
};
