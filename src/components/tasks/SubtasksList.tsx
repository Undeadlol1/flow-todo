import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import arrayMove from 'array-move';
import firebase from 'firebase/app';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { getFirestore } from 'redux-firestore';
import {
  handleErrors,
  showSnackbar,
  useTypedTranslate,
} from '../../services/index';
import { deleteSubtask, Subtask } from '../../store';
import { addPointsWithSideEffects } from '../../store/index';
import { authSelector } from '../../store/selectors';

const useStyles = makeStyles(theme => {
  const color = theme.palette.text.primary;
  return {
    list: {
      width: '100%',
    },
    link: {
      color,
      textDecoration: 'none',
    },
    paper: {
      width: '100%',
      padding: theme.spacing(1),
    },
  };
});

interface Props {
  documents?: Subtask[];
}

const DragHandle = SortableHandle(() => (
  <ListItemIcon style={{ cursor: 'grab' }}>
    <DragHandleIcon />
  </ListItemIcon>
));

const SortableItem = SortableElement(
  ({ subtask }: { subtask: Subtask }) => {
    const t = useTypedTranslate();
    const auth = useSelector(authSelector);
    const classes = useStyles();

    function remove() {
      return deleteSubtask(subtask.parentId, subtask);
    }

    function setDone() {
      showSnackbar(t('goodJobPointsRecieved', { points: 10 }));
      Promise.all([
        remove(),
        addPointsWithSideEffects(auth.uid, 10),
      ]).catch(handleErrors);
    }

    return (
      <ListItem ContainerComponent="div">
        <DragHandle />
        <ListItemIcon>
          <IconButton edge="end" aria-label="Done" onClick={setDone}>
            <CheckBoxIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={subtask.name}
          className={classes.link}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={remove} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

const SortableListContainer = SortableContainer(
  ({ items }: { items: Subtask[] }) => {
    const [t] = useTranslation();
    const classes = useStyles();
    return (
      <List className={classes.list}>
        <ListSubheader>{`${t('subtasks')}:`}</ListSubheader>
        {items.map((i, index) => (
          <SortableItem key={i.id} index={index} subtask={i} />
        ))}
      </List>
    );
  },
);

export default function SubtasksList({ documents, ...props }: Props) {
  const classes = useStyles();
  const firestore = getFirestore(firebase);
  const [subtasksStub, setSubtasksStub] = useState<
    Subtask[] | undefined
  >();

  if (!documents || isEmpty(documents)) return null;

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const taskId = documents[0].parentId;
    const updatedSubtasks = arrayMove(documents, oldIndex, newIndex);
    setSubtasksStub(updatedSubtasks);
    firestore
      .doc('tasks/' + taskId)
      .update({ subtasks: updatedSubtasks })
      .catch(handleErrors);
  };

  return (
    <Paper elevation={6} className={classes.paper}>
      <SortableListContainer
        lockAxis="y"
        onSortEnd={onSortEnd}
        useDragHandle={true}
        items={subtasksStub || documents}
      />
    </Paper>
  );
}
