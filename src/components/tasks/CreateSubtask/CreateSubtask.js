import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { createSubtask } from '../../../store/index.ts';

const useStyles = makeStyles(theme => ({
  container: {},
}));

const CreateSubtask = props => {
  const classes = useStyles();
  const [t] = useTranslation();
  const {
 register, handleSubmit, errors, reset, setError 
} = useForm(
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
  function onSubmit(values) {
    return handleSubmit(() => createSubtask(props.taskId, values)
        .then(() => reset({}))
        .catch(e => setError(e && e.message)),);
  }

  return (
    <form
      className={clsx([classes.container, props.className])}
      onSubmit={onSubmit}
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
