import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get';
import useForm from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';

const validationSchema = Yup.object({
  todoName: Yup.string()
    .min(3, 'Не менее 3 символов')
    .required('Обязательно'),
});

export const CreateTaskContainer = (props) => {
  const [user] = useAuthState(auth());
  return <CreateTask user={user} {...props} />;
};

export default function CreateTask(props) {
  const {
    register, handleSubmit, formState, errors, reset,
  } = useForm({ validationSchema });

  const error = props.error || get(errors, 'todoName.message');
  const isSubmitDisabled = isUndefined(props.isValid)
    ? !props.user || (error || formState.isSubmitting)
    : true;

  function createDocumentAndReset(values) {
    return firestore().collection('tasks').add({
      name: values.todoName,
      userId: props.user.uid,
    })
      .then(() => reset({}));
  }

  return (
    <form onSubmit={handleSubmit(createDocumentAndReset)}>
      <TextField
        label="Создать задачу"
        name="todoName"
        error={Boolean(error)}
        inputRef={register}
        helperText={error}
        autoComplete="off"
      />
      <br />
      <Button disabled={isSubmitDisabled} type="submit">Сохранить</Button>
    </form>
  );
}
