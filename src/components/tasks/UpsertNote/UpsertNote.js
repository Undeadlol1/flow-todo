import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import useForm from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

const UpsertNote = props => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [user] = useAuthState(auth());
  const {
    register,
    handleSubmit,
    formState,
    errors,
    setError,
  } = useForm({
    validationSchema: Yup.object({
      note: Yup.string()
        .max(2000, t('validation.textIsTooLong')),
    }),
  });

  let error;
  if (!user) error = t('Please login');
  else error = props.error || get(errors, 'note.message');

  let isSubmitDisabled = true;
  if (isUndefined(props.isValid)) {
    isSubmitDisabled = error || formState.isSubmitting;
  }

  function createDocumentAndReset({ note }) {
    return firestore()
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
    <form
      className={classes.container}
      onSubmit={handleSubmit(createDocumentAndReset)}
    >
      <TextField
        fullWidth
        multiline
        name="note"
        variant="outlined"
        helperText={error}
        inputRef={register}
        error={Boolean(error)}
        label={t('Add a note')}
        autoComplete="off"
        defaultValue={props.defaultValue}
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        className={classes.button}
        disabled={Boolean(isSubmitDisabled)}
      >
        {t('save')}
      </Button>
    </form>
  );
};

UpsertNote.propTypes = {
  defaultValue: PropTypes.string,
  taskId: PropTypes.string.isRequired,
};

export default UpsertNote;
