import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import replace from 'lodash/fp/replace';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import uniq from 'lodash/uniq';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { When } from 'react-if';
import { useSelector } from 'react-redux';
import { object as YupObject, string as YupString } from 'yup';
import { ViewerController } from '../../../controllers/ViewerController';
import { Task } from '../../../entities/Task';
import { upsertTask } from '../../../repositories/upsertTask';
import { handleErrors } from '../../../services/index';
import Snackbar from '../../../services/Snackbar';
import { authSelector } from '../../../store/selectors';
import TagsForm from '../TagsForm';

const useStyles = makeStyles({
  button: {
    marginTop: '20px',
    width: '100%',
  },
});

interface CommonProps {
  task?: Task;
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

  const tagsRegExp = /#[a-z]+/gi;
  const [text = '', setText] = useState<string>();
  const tags = uniq(
    (text.match(tagsRegExp) || [])
      .concat(props.task?.tags || [])
      .map(replace('#', '')),
  );

  const form = useForm<{ name: string }>({
    resolver: yupResolver(
      YupObject({
        name: YupString()
          .min(3, t('validation.atleast3Symbols'))
          .max(100, t('validation.textIsTooLong'))
          .trim()
          .required(t('validation.required')),
      }),
    ),
  });
  const error = props.userId
    ? get(form, 'errors.name.message', '')
    : t('Please login');

  let isSubmitDisabled: boolean | Error = true;
  if (isUndefined(props.isValid)) {
    isSubmitDisabled = error || form.formState.isSubmitting;
  }

  return (
    <Grow in timeout={800}>
      <form
        onSubmit={form.handleSubmit((values) => {
          values.name = values.name.replace(tagsRegExp, '');
          props.onSubmit(
            {
              ...values,
              tags,
            },
            form.reset,
          );
        })}
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
          defaultValue={props.defaultValue}
          label={props.task ? t('Rework task') : t('createTask')}
          onChange={(event) => setText(event.target.value)}
        />
        <When condition={tags.length !== 0}>
          <Box height={20} />
          <TagsForm tags={tags} taskId={props.task?.id as string} />
        </When>
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
  resetFormOnSuccess?: boolean;
  pointsToAdd?: number;
}

function UpsertTaskContainer({
  task,
  pointsToAdd,
  resetFormOnSuccess = true,
  ...props
}: ContainerProps) {
  const [t] = useTranslation();
  const userId = useSelector(authSelector).uid;

  async function createDocumentAndReset(
    payload: { name: string; tags?: string[] },
    reset: Function,
  ) {
    try {
      props.beforeSubmitHook?.();

      await Promise.all([
        upsertTask({ ...payload, userId, id: task?.id }),
        pointsToAdd
          ? ViewerController.rewardPoints(pointsToAdd)
          : Promise.resolve(),
      ]);

      props.callback?.();

      if (resetFormOnSuccess) reset();
    } catch (error) {
      Snackbar.addToQueue(t('Something went wrong'));
      setTimeout(() => handleErrors(error as Error), 4000);
    }
  }
  const mergedProps = {
    task,
    userId,
    autoFocus: props.autoFocus,
    defaultValue: props.defaultValue,
    onSubmit: createDocumentAndReset,
  };
  return <UpsertTask {...mergedProps} />;
}
export default React.memo(UpsertTaskContainer);
