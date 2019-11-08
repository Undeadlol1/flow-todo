// @flow
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { firestore } from 'firebase/app';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import get from 'lodash/get';

const CreateSubtask = props => {
  const [t] = useTranslation();
  const {
    register, handleSubmit, errors, reset, setError,
  } = useForm(
    {
      validationSchema: Yup.object({
        name: Yup.string()
          .min(3, t('validation.atleast3Symbols'))
          .required(t('validation.required')),
      }),
    },
  );
  const error = get(errors, 'name.message');

  function createSubtask(values) {
    //  TODO i need to put it into a reusable function
    return firestore()
      .collection('tasks')
      .doc(props.taskId)
      .update({
        subtasks: firestore.FieldValue.arrayUnion(values),
      })
      .then(() => reset({}))
      .catch(e => setError(e && e.message));
  }

  return (
    <form onSubmit={handleSubmit(createSubtask)}>
      <TextField
        name="name"
        inputRef={register}
        error={Boolean(error)}
        label={t('Add subtasks')}
        helperText={get(errors, 'name.message')}
      />
    </form>
  );
};

CreateSubtask.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default CreateSubtask;
