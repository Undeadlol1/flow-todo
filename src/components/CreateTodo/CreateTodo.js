import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from 'formik-material-ui';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const formConfig = {
    initialValues: { todoName: '' },
    validationSchema: Yup.object({
        todoName: Yup.string()
            .min(3, 'Не менее 3 символов')
            .required('Обязательно')
    }),
    onSubmit: (values, { setSubmitting }) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 400);
    }
}

export default function CreateTodo(props) {
    return (
        <Formik {...formConfig}>
            {({ isValid, isSubmitting }) => {
                return (
                    <Form>
                        <Field type="text" margin="normal" component={TextField} name="todoName" label="Создать задачу" />
                        <br />
                        <Button disabled={!isValid || isSubmitting} type="submit">Сохранить</Button>
                    </Form>
                )
            }}
        </Formik>
    );

}