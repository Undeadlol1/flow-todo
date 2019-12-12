import React, { memo } from 'react';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import invoke from 'lodash/invoke';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { firestore } from 'firebase/app';
import { useTypedSelector } from '../../store/index';
import {
  handleErrors,
  useTypedTranslate,
} from '../../services/index';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  container: {},
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  className?: string;
  callback?: Function;
}

const CreateReward = (props: Props) => {
  const cx = useStyles();
  const { t } = useTranslation();
  const tt = useTypedTranslate();
  const userId: string = useTypedSelector(s =>
    get(s, 'firebase.auth.uid'),
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
      // TODO i18n
      name: Yup.string()
        .min(3, t('validation.atleast3Symbols'))
        .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
      points: Yup.number()
        // .min(3, t('validation.atleast3Symbols'))
        // .max(100, t('validation.textIsTooLong'))
        .required(t('validation.required')),
    }),
  });
  const error = get(errors, 'name.message');
  function onSubmit(values: any) {
    console.log('values: ', values);
    return firestore()
      .collection('rewards')
      .add({ ...values, userId })
      .then(() => {
        reset({});
        invoke(props, 'callback');
      })
      .catch(e => {
        handleErrors(e);
        setError('name', 'mismatch', get(e, 'message', e));
      });
  }

  return (
    <Card className={clsx([cx.container, props.className])}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle2">
            {tt('add a reward')}
          </Typography>
          <TextField
            fullWidth
            name="name"
            variant="outlined"
            className={cx.input}
            inputRef={register}
            error={Boolean(error)}
            label={tt('reward name')}
            helperText={get(errors, 'name.message')}
          />
          <TextField
            fullWidth
            type="number"
            name="points"
            variant="outlined"
            autoComplete="off"
            inputRef={register}
            className={cx.input}
            error={Boolean(error)}
            label={tt('reward points')}
            helperText={get(errors, 'name.points')}
          />
          <Box textAlign="center">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              disabled={Boolean(formState.isSubmitting)}
            >
              {t('save')}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(CreateReward);
