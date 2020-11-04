import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { showSnackbar } from '../../../services';

const useStyles = makeStyles({
  container: {
    textAlign: 'left',
  },
});

const UpsertNote = props => {
  const classes = useStyles();
  const [t] = useTranslation();
  const [user] = useAuthState(auth());
  const {
    register,
    errors,
    setError,
    getValues,
    clearError,
    handleSubmit,
  } = useForm();

  let error;
  if (!user) error = t('Please login');
  else error = props.error || get(errors, 'note.message');

  function createNote() {
    const { note } = getValues();
    if (typeof note === 'undefined') return;
    if (!note && !props.defaultValue) return;
    if (note === props.defaultValue) return;
    if (note.length > 5000) {
      setError('note', 'tooLong', t('validation.textIsTooLong'));
      return;
    }

    clearError('note');
    firestore()
      .collection('tasks')
      .doc(props.taskId)
      .update({
        noteUpdatedAt: Date.now(),
        note: note && note.trim(),
      })
      .then(() => showSnackbar(t('Successfully saved')))
      .catch(e => setError(e && e.message));
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

UpsertNote.propTypes = {
  children: PropTypes.element,
  error: PropTypes.string,
  defaultValue: PropTypes.string,
  taskId: PropTypes.string.isRequired,
};

export default UpsertNote;
