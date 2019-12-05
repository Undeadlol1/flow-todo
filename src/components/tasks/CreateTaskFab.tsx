import React from 'react';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use/esm/useToggle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import UpsertTask from './CreateTask/UpsertTask';
import isEmpty from 'lodash/isEmpty';
import Fab from '../ui/Fab';
import AddIcon from '@material-ui/icons/Add';
import cx from 'clsx';

interface Props {
  isHidden?: boolean;
  activeTasks?: [];
  createdAtleastOneTask?: [];
  className?: string;
}

export const CreateTaskFab: React.FC<Props> = props => {
  const [t] = useTranslation();
  const [isDialogOpen, toggleDialog] = useToggle(false);
  return (
    <>
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
        className={cx([props.className, 'IntroHandle__createTask'])}
        isHidden={props.isHidden}
      >
        {!isEmpty(props.createdAtleastOneTask) &&
        isEmpty(props.activeTasks) ? (
          '+10'
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
};

export default CreateTaskFab;
