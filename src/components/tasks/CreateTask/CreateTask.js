import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import useForm from 'react-hook-form';
import { auth } from 'firebase/app';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import { useSnackbar } from 'notistack';
import invoke from 'lodash/invoke';
import { createTask } from '../../../store/index';

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
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .required(t('validation.required')),
    }),
  });

  let error;
  if (!props.user) error = t('Please login');
  else error = props.error || get(errors, 'name.message');

  let isSubmitDisabled = true;
  if (isUndefined(props.isValid)) {
    isSubmitDisabled = error || formState.isSubmitting;
  }

  function createDocumentAndReset({ name }) {
    return createTask({ name, userId: props.user.id })
      .then(() => {
        reset();
        enqueueSnackbar(t('Successfully saved'), {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
            autoHideDuration: 2000,
          },
        });
        invoke(props, 'callback');
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
          name="name"
          variant="outlined"
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

CreateTask.defaultValues = {
  callback: () => { },
};

CreateTask.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  isValid: PropTypes.bool,
  callback: PropTypes.func,
};

export default function CreateTaskContainer(props) {
  const [user] = useAuthState(auth());
  return <CreateTask user={user} {...props} />;
}
