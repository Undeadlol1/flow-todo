// @flow
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import subtractDays from 'date-fns/subDays';
import { useTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
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
    console.log('props.taskId', props.taskId);
    console.log('values: ', values);
  }

  return (
    <form onSubmit={handleSubmit(createSubtask)}>
      <TextField
        name="name"
        error={Boolean(error)}
        inputRef={register}
        helperText={get(errors, 'name.message')}
        label="Добвить подзадачу"
      />
    </form>
  );
};

CreateSubtask.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default CreateSubtask;
