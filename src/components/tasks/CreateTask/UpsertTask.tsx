import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import isUndefined from 'lodash/isUndefined';
import React from 'react';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  handleErrors,
  useTypedTranslate,
} from '../../../services/index';
import Snackbar from '../../../services/Snackbar';
import {
  addPointsWithSideEffects,
  upsertTask,
} from '../../../store/index';
import { authSelector } from '../../../store/selectors';

const useStyles = makeStyles({
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

interface CommonProps {
  taskId?: string;
  autoFocus?: boolean;
  defaultValue?: string | null;
}

interface ComponentProps extends CommonProps {
  error?: Error;
  isValid?: boolean;
  userId?: string;
  onSubmit: Function;
}

export function UpsertTask(props: ComponentProps) {
  const classes = useStyles();
  const [t] = useTranslation();
  const form = useForm<{ name: string }>({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
    }),
  });
  const error = props.userId
    ? get(form, 'errors.name.message')
    : t('Please login');

  let isSubmitDisabled: boolean | Error = true;
  if (isUndefined(props.isValid)) {
    isSubmitDisabled = error || form.formState.isSubmitting;
  }

  return (
    <Grow in timeout={800}>
      <form
        onSubmit={form.handleSubmit((values: any) =>
          props.onSubmit(values, form.reset),
        )}
      >
        <TextField
          fullWidth
          name="name"
          variant="outlined"
          autoComplete="off"
          helperText={error}
          error={Boolean(error)}
          inputRef={form.register}
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

interface ContainerProps extends CommonProps {
  callback?: Function;
  beforeSubmitHook?: Function;
  showSnackbarOnSuccess?: boolean;
  resetFormOnSuccess?: boolean;
  pointsToAdd?: number;
}

function UpsertTaskContainer({
  taskId,
  pointsToAdd,
  showSnackbarOnSuccess = true,
  resetFormOnSuccess = true,
  ...props
}: ContainerProps) {
  const [t] = useTranslation();
  const translate = useTypedTranslate();
  const userId = useSelector(authSelector).uid;

  async function createDocumentAndReset(
    { name }: { name: string },
    reset: Function,
  ) {
    try {
      invoke(props, 'beforeSubmitHook');

      await Promise.all([
        upsertTask({ name, userId }, taskId),
        pointsToAdd
          ? addPointsWithSideEffects(userId, pointsToAdd || 10)
          : Promise.resolve(),
      ]);

      invoke(props, 'callback');
      if (resetFormOnSuccess) reset();
      if (showSnackbarOnSuccess) {
        Snackbar.addToQueue(
          pointsToAdd
            ? translate('Successfully saved') +
                '. ' +
                translate('points added', { points: pointsToAdd })
            : translate('Successfully saved'),
        );
      }
    } catch (error) {
      Snackbar.addToQueue(t('Something went wrong'));
      setTimeout(() => handleErrors(error), 4000);
    }
  }
  const mergedProps = {
    taskId,
    userId,
    autoFocus: props.autoFocus,
    defaultValue: props.defaultValue,
    onSubmit: createDocumentAndReset,
  };
  return <UpsertTask {...mergedProps} />;
}
export default React.memo(UpsertTaskContainer);
