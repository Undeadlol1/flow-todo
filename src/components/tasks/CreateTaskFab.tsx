import React from 'react';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use/lib/useToggle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import isEmpty from 'lodash/isEmpty';
import AddIcon from '@material-ui/icons/Add';
import cx from 'clsx';
import Fab from '../ui/Fab';
import UpsertTask from './CreateTask/UpsertTask';

interface Props {
  isHidden?: boolean;
  activeTasks?: [];
  createdAtleastOneTask?: [];
  className?: string;
}

export const CreateTaskFab: React.FC<Props> = props => {
  const [t] = useTranslation();
  const [isDialogOpen, toggleDialog] = useToggle(false);
  const createdTasksBefore = !isEmpty(props.createdAtleastOneTask);
  return (
    <>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="form-dialog-title"
        onClose={toggleDialog}
      >
        <DialogContent>
          <UpsertTask
            autoFocus
            pointsToAdd={10}
            beforeSubmitHook={toggleDialog}
          />
        </DialogContent>
      </Dialog>
      <Fab
        aria-label={t('createTask')}
        className={cx([
          props.className,
          'IntroHandle__createTask',
          !createdTasksBefore && 'animated pulse infinite',
        ])}
        isHidden={props.isHidden}
        onClick={toggleDialog}
      >
        {createdTasksBefore && isEmpty(props.activeTasks) ? (
          '+10'
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
};

export default CreateTaskFab;
