import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import useForm from 'react-hook-form';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import { useSnackbar } from 'notistack';
import { upsertTask, addPoints } from '../../../store/index';
import { FormState, Ref } from 'react-hook-form/dist/types';
import invoke from 'lodash/invoke';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

const useStyles = makeStyles({
  container: {},
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
  beforeSubmitHook?: Function;
  showSnackbarOnSuccess?: boolean;
  resetFormOnSuccess?: boolean;
}

function UpsertTaskContainer(props: ContainerProps) {
  const {
    taskId,
    callback,
    showSnackbarOnSuccess = true,
    resetFormOnSuccess = true,
  } = props;
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const userId: string = useSelector(s =>
    get(s, 'firebase.auth.uid'),
  );
  const activeTasks = useSelector(s =>
    get(s, 'firestore.ordered.activeTasks'),
  );
  const shouldAddBonusPoints = isEmpty(activeTasks);

  const form = useForm<FormData>({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
    }),
  });

  async function createDocumentAndReset({ name }: { name: string }) {
    invoke(props, 'beforeSubmitHook');
    try {
      await upsertTask({ name, userId }, props.taskId);
      if (shouldAddBonusPoints) await addPoints(userId, 10);
      if (resetFormOnSuccess) form.reset();
      if (showSnackbarOnSuccess) {
        enqueueSnackbar(t('Successfully saved'), {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        });
      }
      if (callback) callback();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        t('Something went wrong') +
          '. ' +
          (props.taskId ? error.message : t('task was note created')),
        {
          variant: 'error',
        },
      );
    }
  }
  const mergedProps = {
    taskId,
    autoFocus: props.autoFocus,
    defaultValue: props.defaultValue,
    onSubmit: createDocumentAndReset,
    error: userId
      ? get(form, 'errors.name.message')
      : t('Please login'),
    ...form,
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

export default React.memo(UpsertTaskContainer);
