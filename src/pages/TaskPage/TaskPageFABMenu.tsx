import Backdrop from '@material-ui/core/Backdrop';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import invoke from 'lodash/invoke';
import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import useToggle from 'react-use/esm/useToggle';
import { useFabStyles } from '../../components/ui/Fab';

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

  function makePinned() {
    firestoreRedux.update('tasks/' + props.taskId, {
      isPinned: true,
    });
  }

  const actions = [
    { icon: <FileCopyIcon />, name: 'Pin', onClick: makePinned },
    // { icon: <SaveIcon />, name: 'Save' },
    // { icon: <PrintIcon />, name: 'Print' },
    // { icon: <ShareIcon />, name: 'Share' },
    // { icon: <FavoriteIcon />, name: 'Like' },
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
