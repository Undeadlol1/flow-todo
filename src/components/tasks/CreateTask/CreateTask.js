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
import subtractDays from 'date-fns/subDays';
import { useTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
  container: {
    margin: '10px',
  },
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

export function CreateTask(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [t] = useTranslation();
  const {
    register,
    handleSubmit,
    formState,
    errors,
    reset,
    setError,
  } = useForm({
    validationSchema: Yup.object({
      todoName: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .required(t('validation.required')),
    }),
  });

  const error = props.error || get(errors, 'todoName.message');
  const isSubmitDisabled = isUndefined(props.isValid)
    ? !props.user || (error || formState.isSubmitting)
    : true;

  function createDocumentAndReset(values) {
    return firestore()
      .collection('tasks')
      .add({
        isDone: false,
        name: values.todoName,
        userId: props.user.uid,
        dueAt: subtractDays(new Date(), 1).getTime(),
      })
      .then(() => {
        reset({});
        enqueueSnackbar(t('Successfully saved'));
      })
      .catch(e => setError(e && e.message));
  }

  return (
    <Grow in timeout={800}>
      <form
        className={classes.container}
        onSubmit={handleSubmit(createDocumentAndReset)}
      >
        <TextField
          fullWidth
          autoFocus
          variant="outlined"
          name="todoName"
          autoComplete="off"
          helperText={error}
          inputRef={register}
          error={Boolean(error)}
          label={t('createTask')}
          className="CreateTask__input"
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
    </Grow>
  );
}

CreateTask.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  isValid: PropTypes.bool,
};

export default function CreateTaskContainer(props) {
  const [user] = useAuthState(auth());
  return <CreateTask user={user} {...props} />;
}
