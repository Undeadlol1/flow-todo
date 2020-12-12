import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use/lib/useToggle';
import Fab from '../ui/Fab';
import UpsertTask from './CreateTask/UpsertTask';

interface Props {
  isHidden?: boolean;
}

export const CreateTaskFab: React.FC<Props> = (props) => {
  const [t] = useTranslation();
  const [isDialogOpen, toggleDialog] = useToggle(false);
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
        isHidden={props.isHidden}
        aria-label={t('createTask')}
        onClick={toggleDialog}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default CreateTaskFab;
