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
import { upsertTask } from '../../../store/index';

const useStyles = makeStyles({
  container: {
    margin: '10px',
  },
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

export function CreateTask({ error, ...props }) {
  const classes = useStyles();
  const [t] = useTranslation();

  let isSubmitDisabled = true;
  if (isUndefined(props.isValid)) {
    // eslint-disable-next-line react/prop-types
    isSubmitDisabled = error || props.formState.isSubmitting;
  }

  return (
    <Grow in timeout={800}>
      <form
        className={classes.container}
        onSubmit={props.handleSubmit(props.onSubmit)}
      >
        <TextField
          fullWidth
          name="name"
          variant="outlined"
          autoComplete="off"
          helperText={error}
          error={Boolean(error)}
          inputRef={props.register}
          autoFocus={props.autoFocus}
          className="CreateTask__input"
          defaultValue={props.defaultValue}
          label={props.taskId ? t('Rework task') : t('createTask')}
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
  callback: () => {},
};

CreateTask.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  isValid: PropTypes.bool,
  taskId: PropTypes.string,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  callback: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

function CreateTaskContainer(props) {
  const [t] = useTranslation();
  const [user] = useAuthState(auth());
  const formProps = useForm({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .required(t('validation.required')),
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  function createDocumentAndReset({ name }) {
    return upsertTask({ name, userId: user.uid }, props.taskId)
      .then(() => {
        // TODO add "resetFormOnSuccess" property instead of this
        // eslint-disable-next-line no-unused-expressions
        !props.taskId && formProps.reset();
        if (props.showSnackbarOnSuccess) {
          enqueueSnackbar(t('Successfully saved'), {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
              autoHideDuration: 2000,
            },
          });
        }
        invoke(props, 'callback');
      })
      .catch(e => formProps.setError('name', 'misMatch', e && e.message),);
  }
  const mergedProps = {
    user,
    onSubmit: createDocumentAndReset,
    error: user
      ? get(formProps, 'errors.name.message')
      : t('Please login'),
    ...formProps,
    ...props,
  };
  return <CreateTask {...mergedProps} />;
}

CreateTaskContainer.defaultValues = {
  showSnackbarOnSuccess: true,
};

CreateTaskContainer.propTypes = {
  callback: PropTypes.func,
  taskId: PropTypes.string,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  showSnackbarOnSuccess: PropTypes.bool,
};

export default CreateTaskContainer;
