// @flow
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
import { createSubtask } from '../../../store/index.ts';

const CreateSubtask = props => {
  const [t] = useTranslation();
  const {
    register, handleSubmit, errors, reset, setError,
  } = useForm({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .required(t('validation.required')),
    }),
  });
  const error = get(errors, 'name.message');
// TODO: Better name
  function onSubmit(values) {
    console.log('on submit');
    createSubtask(props.taskId, values)
      .then(() => reset({}))
      .catch(e => setError(e && e.message));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={6}>
        <TextField
          fullWidth
          name="name"
          inputRef={register}
          error={Boolean(error)}
          label={t('Add subtasks')}
          helperText={get(errors, 'name.message')}
        />
      </Paper>
    </form>
  );
};

CreateSubtask.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default CreateSubtask;
