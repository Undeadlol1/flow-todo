import Backdrop from '@material-ui/core/Backdrop';
import { createStyles, makeStyles, Theme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RestoreIcon from '@material-ui/icons/Restore';
import RoomIcon from '@material-ui/icons/Room';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import invoke from 'lodash/invoke';
import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import useToggle from 'react-use/lib/useToggle';
import { useFabStyles } from '../../components/ui/Fab';
import {
  handleErrors,
  showSnackbar,
  useTypedTranslate,
} from '../../services/index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    speedDial: {},
  }),
);

interface Props {
  taskId?: string;
}

export default function TaskPageFABMenu(props: Props) {
  const classes = useStyles();
  const fabClasses = useFabStyles();
  const [open, toggleOpen] = useToggle(false);
  const firestoreRedux = useFirestore();
  const history = useHistory();
  const t = useTypedTranslate();

  function pin() {
    firestoreRedux
      .update('tasks/' + props.taskId, {
        isPinned: true,
      })
      .catch(handleErrors);
    history.push('/');
  }

  function resetIntervals() {
    firestoreRedux
      .update('tasks/' + props.taskId, {
        repetitionLevel: 0,
      })
      .then(() => showSnackbar(t('Successfully saved')))
      .catch(handleErrors);
  }

  const actions = [
    { icon: <RoomIcon />, name: t('pin'), onClick: pin },
    {
      icon: <RestoreIcon />,
      name: t('reset intervals'),
      onClick: resetIntervals,
    },
  ];

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        //   TODO: i18n
        ariaLabel="SpeedDial tooltip example"
        // TODO: change name to "root"
        className={fabClasses.fab}
        icon={
          <SpeedDialIcon
            icon={<MoreVertIcon />}
            openIcon={<CloseIcon />}
          />
        }
        onOpen={() => toggleOpen(true)}
        onClose={() => toggleOpen(false)}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            tooltipOpen
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              invoke(action, 'onClick');
              toggleOpen(false);
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
