import { Box, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Formik } from 'formik';
import React, { memo } from 'react';

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
          if (!values.title) {
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
        {({
 values, handleChange, handleBlur, handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <TextField
      fullWidth
      name="title"
      value={values.title}
      variant="outlined"
      label="Title"
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </form>
        )}
      </Formik>
    </Box>
  );
});

UpsertDailyGoal.displayName = 'UpsertDailyGoal';

export { UpsertDailyGoal };
