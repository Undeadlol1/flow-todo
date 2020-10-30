import { Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import React, { memo } from 'react';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use/lib/useToggle';
import { object as YupObject, string as YupString } from 'yup';
import { createSubtask } from '../../../store/index';

const useStyles = makeStyles((theme: Theme) => ({
  container: {},
}));

interface Props {
  className?: string;
  taskId: string;
  callback?: Function;
}

const CreateSubtask = (props: Props) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const [isLocked, toggleLock] = useToggle(false);
  const { register, handleSubmit, errors, reset, setError } = useForm(
    {
      validationSchema: YupObject({
        name: YupString()
          .min(3, t('validation.atleast3Symbols'))
          .max(100, t('validation.textIsTooLong'))
          .required(t('validation.required')),
      }),
    },
  );
  const error = get(errors, 'name.message');

  function onSubmit(values: any) {
    toggleLock();
    return createSubtask(props.taskId, values)
      .then(() => {
        reset({});
        toggleLock();
        invoke(props, 'callback');
      })
      .catch(e => setError('name', 'mismatch', get(e, 'message', e)));
  }

  return (
    <form
      className={clsx([classes.container, props.className])}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        fullWidth
        name="name"
        variant="outlined"
        autoComplete="off"
        inputRef={register}
        disabled={isLocked}
        error={Boolean(error)}
        label={t('Add subtasks')}
        helperText={get(errors, 'name.message')}
      />
    </form>
  );
};

export default memo(CreateSubtask);
