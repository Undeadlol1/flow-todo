import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { createSubtask } from '../../../store/index';
import invoke from 'lodash/invoke';

const useStyles = makeStyles(theme => ({
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
  const { register, handleSubmit, errors, reset, setError } = useForm(
    {
      validationSchema: Yup.object({
        name: Yup.string()
          .min(3, t('validation.atleast3Symbols'))
          .max(100, t('validation.textIsTooLong'))
          .required(t('validation.required')),
      }),
    },
  );
  const error = get(errors, 'name.message');
  function onSubmit(values: any) {
    return createSubtask(props.taskId, values)
      .then(() => {
        reset({});
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
        error={Boolean(error)}
        label={t('Add subtasks')}
        helperText={get(errors, 'name.message')}
      />
    </form>
  );
};

CreateSubtask.propTypes = {
  className: PropTypes.string,
  taskId: PropTypes.string.isRequired,
};

export default CreateSubtask;
