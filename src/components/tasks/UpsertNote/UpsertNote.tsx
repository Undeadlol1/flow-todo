import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import firebase from 'firebase/app';
import get from 'lodash/get';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { showSnackbar } from '../../../services';
import { authSelector } from '../../../store/selectors';

const useStyles = makeStyles({
  container: {
    textAlign: 'left',
  },
});

const UpsertNote = (props: {
  error?: string;
  taskId: string | undefined;
  defaultValue: string | undefined;
  children?: React.ReactElement;
}) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const user = useSelector(authSelector);
  const {
    register,
    errors,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
  } = useForm();

  let error;
  if (!user?.uid) error = t('Please login');
  else error = props.error || get(errors, 'note.message');

  function createNote() {
    const { note } = getValues();
    if (typeof note === 'undefined') return;
    if (!note && !props.defaultValue) return;
    if (note === props.defaultValue) return;
    if (note.length > 5000) {
      setError('note', { message: t('validation.textIsTooLong') });
      return;
    }

    clearErrors('note');
    firebase
      .firestore()
      .collection('tasks')
      .doc(props.taskId)
      .update({
        noteUpdatedAt: Date.now(),
        note: note && note.trim(),
      })
      .then(() => showSnackbar(t('Successfully saved')))
      .catch((e) => setError('note', { message: e && e.message }));
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(createNote)}
    >
      {props.children}
      <TextField
        multiline
        fullWidth
        name="note"
        variant="outlined"
        autoComplete="off"
        helperText={error}
        inputRef={register}
        error={Boolean(error)}
        label={
          props.defaultValue ? t('Edit the note') : t('Add a note')
        }
        defaultValue={props.defaultValue}
      />
      <Box textAlign="center" mt={2}>
        <Button
          fullWidth
          type="submit"
          color="secondary"
          variant="contained"
        >
          {t('save')}
        </Button>
      </Box>
    </form>
  );
};

export default UpsertNote;
