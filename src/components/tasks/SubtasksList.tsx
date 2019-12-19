import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import arrayMove from 'array-move';
import firebase from 'firebase/app';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { getFirestore } from 'redux-firestore';
import { deleteSubtask, Subtask } from '../../store';
import { handleErrors } from '../../services/index';

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
    const classes = useStyles();
    return (
      <ListItem ContainerComponent="div">
        <DragHandle />
        <ListItemText
          primary={subtask.name}
          className={classes.link}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="Delete"
            onClick={() => deleteSubtask(subtask.parentId, subtask)}
          >
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
