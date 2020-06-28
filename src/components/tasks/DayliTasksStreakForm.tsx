import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
} from '@material-ui/core';
import React, { memo } from 'react';
import useForm from 'react-hook-form';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import { useTypedSelector } from '../../store';
import { firestore } from 'firebase';
import { handleErrors } from '../../services';

function DayliTasksStreakForm() {
  const [t] = useTranslation();
  const userId = useTypedSelector(
    s => get(s, 'firebase.auth.uid') as string,
  );
  const {
    register,
    formState,
    handleSubmit,
    errors,
    reset,
    setError,
  } = useForm({
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
      points: Yup.number()
        .min(1, t('validation.minimumValue', { value: 1 }))
        .max(10000, t('validation.maximumValue', { value: 10000 }))
        .required(t('validation.required')),
      image: Yup.string().url(t('validation.invalidURL')),
      isReccuring: Yup.boolean(),
    }),
  });

  const error = get(errors, 'name.message');
  function onSubmit(values: any) {
    console.log('values: ', values);
    // TODO
    // return firestore()
    //   .collection('rewards')
    //   .add({ ...values, userId })
    //   .then(() => {
    //     reset({});
    //     // invoke(props, 'callback');
    //   })
    //   .catch(e => {
    //     handleErrors(e);
    //     setError('name', 'mismatch', get(e, 'message', e));
    //   });
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            type="number"
            name="perDay"
            // variant="outlined"
            autoComplete="off"
            inputRef={register}
            // className={cx.input}
            label="Задач в день"
            // label={t('')}
            defaultValue={3}
            helperText={get(errors, 'points.message')}
            error={Boolean(get(errors, 'points.message'))}
          />
        </form>
      </CardContent>
    </Card>
  );
}

export default memo(DayliTasksStreakForm);
