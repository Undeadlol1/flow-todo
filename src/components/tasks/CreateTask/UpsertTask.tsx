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
import { upsertTask } from '../../../store/index';
import { FormState, Ref } from 'react-hook-form/dist/types';

const useStyles = makeStyles({
  container: {
    margin: '10px',
  },
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

interface CommonProps {
  taskId?: string;
  autoFocus?: boolean;
  defaultValue?: string;
}

interface ComponentProps extends CommonProps {
  error?: Error;
  register: Ref;
  isValid?: boolean;
  formState: FormState;
  onSubmit: Function;
  handleSubmit: Function;
}

export function UpsertTask({ error, ...props }: ComponentProps) {
  const classes = useStyles();
  const [t] = useTranslation();

  let isSubmitDisabled: boolean | Error = true;
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

UpsertTask.defaultValues = {
  callback: () => {},
};

UpsertTask.propTypes = {
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

type FormData = {
  name: string;
};

interface ContainerProps extends CommonProps {
  callback?: Function;
  showSnackbarOnSuccess?: boolean;
  resetFormOnSuccess?: boolean;
}

function UpsertTaskContainer(props: ContainerProps) {
  const {
    taskId,
    showSnackbarOnSuccess = true,
    resetFormOnSuccess = true,
  } = props;
  const [t] = useTranslation();
  const [user] = useAuthState(auth());
  const formProps = useForm<FormData>({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  function createDocumentAndReset({ name }: { name: string }) {
    return upsertTask(
      { name, userId: user && user.uid },
      props.taskId,
    )
      .then(() => {
        if (resetFormOnSuccess) formProps.reset();
        if (showSnackbarOnSuccess) {
          enqueueSnackbar(t('Successfully saved'), {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          });
        }
        if (props.callback) props.callback();
      })
      .catch(e =>
        formProps.setError('name', 'misMatch', e && e.message),
      );
  }
  const mergedProps = {
    user,
    taskId,
    autoFocus: props.autoFocus,
    defaultValue: props.defaultValue,
    onSubmit: createDocumentAndReset,
    error: user
      ? get(formProps, 'errors.name.message')
      : t('Please login'),
    ...formProps,
  };
  return <UpsertTask {...mergedProps} />;
}

UpsertTaskContainer.defaultValues = {
  showSnackbarOnSuccess: true,
} as Partial<ContainerProps>;

UpsertTaskContainer.propTypes = {
  callback: PropTypes.func,
  taskId: PropTypes.string,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  showSnackbarOnSuccess: PropTypes.bool,
  resetFormOnSuccess: PropTypes.bool,
};

export default UpsertTaskContainer;
