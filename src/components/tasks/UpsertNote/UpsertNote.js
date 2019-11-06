import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import useForm from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';

const useStyles = makeStyles({
  container: {
    textAlign: 'left',
  },
  button: {
    width: '100%',
    marginTop: '20px',
  },
});

const UpsertNote = props => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [user] = useAuthState(auth());
  const {
    register,
    errors,
    setError,
    getValues,
    clearError,
  } = useForm();

  let error;
  if (!user) error = t('Please login');
  else error = props.error || get(errors, 'note.message');

  function createNote() {
    const { note } = getValues();
    if (typeof note === 'undefined') return;
    if (!note && !props.defaultValue) return;
    if (note === props.defaultValue) return;
    if (note.length > 2000) {
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
      .then(() => enqueueSnackbar(t('Successfully saved')))
      .catch(e => setError(e && e.message));
  }

  return (
    <form className={classes.container}>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        name="note"
        autoComplete="off"
        helperText={error}
        defaultValue={props.defaultValue}
        inputRef={register()}
        error={Boolean(error)}
        label={t('Add a note')}
        onChange={debounce(createNote, 1500)}
      />
    </form>
  );
};

UpsertNote.propTypes = {
  error: PropTypes.string,
  defaultValue: PropTypes.string,
  taskId: PropTypes.string.isRequired,
};

export default UpsertNote;
