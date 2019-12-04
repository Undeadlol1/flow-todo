import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import cx from 'clsx';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use-toggle';
import UpsertTask from '../../components/tasks/CreateTask/UpsertTask';
import GetRandomTask from '../../components/tasks/RandomTaskButton/RandomTaskButton';
import AppTour from '../../components/ui/AppTour';
import Fab from '../../components/ui/Fab';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { useTypedSelector, Task } from '../../store/index';

const log = debug('HomePage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
  randomButtonContainer: {
    margin: '0 auto',
  },
}));

interface Props {
  activeTasks?: Task[];
  isLoading?: boolean;
  isAppTourActive?: boolean;
  createdAtleastOneTask?: Task[];
}

export const HomePage = memo(function HomePage(props: Props) {
  const classes = useStyles();
  const [t] = useTranslation();
  const [isDialogOpen, toggleDialog] = useToggle(false);

  const {
    isLoading,
    activeTasks,
    isAppTourActive,
    createdAtleastOneTask,
  } = props;
  log('isLoading: ', isLoading);
  log('activeTasks: ', activeTasks);
  log('createdAtleastOneTask: ', createdAtleastOneTask);

  function renderButtonOrWelcomeCard() {
    if (isLoading || !isEmpty(createdAtleastOneTask))
      return <GetRandomTask className={'IntroHandle__taskButton'} />;
    else return <WelcomeCard />;
  }

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      direction="column"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={6}
        className={classes.randomButtonContainer}
      >
        {renderButtonOrWelcomeCard()}
      </Grid>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <UpsertTask autoFocus beforeSubmitHook={toggleDialog} />
        </DialogContent>
      </Dialog>
      <Fab
        onClick={toggleDialog}
        aria-label={t('createTask')}
        className={cx(['IntroHandle__createTask'])}
        isHidden={isLoading || !isAppTourActive}
      >
        {!isEmpty(createdAtleastOneTask) && isEmpty(activeTasks) ? (
          '+10'
        ) : (
          <AddIcon />
        )}
      </Fab>
      <AppTour />
    </Grid>
  );
});

export default memo(function HomePageContainer(props) {
  const { createdAtleastOneTask, activeTasks } = useTypedSelector(
    s => s.firestore.ordered,
  );
  const { isAppTourActive } = useTypedSelector(state => state.ui);
  const isLoading = isUndefined(createdAtleastOneTask || activeTasks);
  return (
    <HomePage
      {...{
        isLoading,
        activeTasks,
        isAppTourActive,
        createdAtleastOneTask,
      }}
    />
  );
});
