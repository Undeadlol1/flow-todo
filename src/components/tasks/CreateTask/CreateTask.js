import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import useForm from 'react-hook-form';
import { firestore, auth } from 'firebase/app';
import isUndefined from 'lodash/isUndefined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import subtractDays from 'date-fns/subDays';

const useStyles = makeStyles({
  container: {
    margin: '10px',
  },
  button: {
    marginTop: '20px',
  },
});

const validationSchema = Yup.object({
  todoName: Yup.string()
    .min(3, 'Не менее 3 символов')
    .required('Обязательно'),
});

export function CreateTask(props) {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState,
    errors,
    reset,
  } = useForm({ validationSchema });

  const error = props.error || get(errors, 'todoName.message');
  const isSubmitDisabled = isUndefined(props.isValid)
    ? !props.user || (error || formState.isSubmitting)
    : true;

  function createDocumentAndReset(values) {
    return firestore()
      .collection('tasks')
      .add({
        isDone: false,
        name: values.todoName,
        userId: props.user.uid,
        dueAt: subtractDays(new Date(), 1).getTime(),
      })
      .then(() => reset({}))
      .catch(e => console.error(e));
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(createDocumentAndReset)}
    >
      <TextField
        fullWidth
        name="todoName"
        autoComplete="off"
        helperText={error}
        inputRef={register}
        error={Boolean(error)}
        label="Создать задачу"
        className="CreateTask__input"
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        className={classes.button}
        disabled={isSubmitDisabled}
      >
        Сохранить
      </Button>
    </form>
  );
}

CreateTask.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  isValid: PropTypes.bool,
};

export default function CreateTaskContainer(props) {
  const [user] = useAuthState(auth());
  return <CreateTask user={user} {...props} />;
}
