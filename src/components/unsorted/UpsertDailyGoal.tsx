import {
  Box,
  Button,
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { memo } from 'react';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface Props {
  className?: string;
}

const UpsertDailyGoal = memo((props: Props) => {
  const classes = useStyles();
  const rootClasses = classNames(classes.root, props.className);

  return (
    <Box className={rootClasses}>
      <Formik
        initialValues={{ title: '' }}
        validate={values => {
          const errors: Partial<{ title: string }> = {};
          if (!values.title?.trim()) {
            errors.title = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs>
                  <Field
                  fullWidth
                  name="title"
                  // TODO: i18n
                  label="Название"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.title}
                  component={TextField}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  {/*  TODO: i18n */}
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
});

UpsertDailyGoal.displayName = 'UpsertDailyGoal';

export { UpsertDailyGoal };
