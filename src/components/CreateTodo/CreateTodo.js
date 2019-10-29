import React from 'react';
import * as Yup from 'yup';
import get from 'lodash/get'
import useForm from 'react-hook-form'
import isUndefined from 'lodash/isUndefined'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const validationSchema = Yup.object({
    todoName: Yup.string()
        .min(3, 'Не менее 3 символов')
        .required('Обязательно')
})

export default function CreateTodo(props) {
    const { register, handleSubmit, formState, errors, reset } = useForm({ validationSchema })
    const isSubmitDisabled = isUndefined(props.isValid) ? (errors.todoName || formState.isSubmitting) : true
    function onSubmit(values) {
        console.log('values: ', values);
        reset({})
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Создать задачу"
                name="todoName"
                error={errors.todoName}
                inputRef={register}
                helperText={get(errors, 'todoName.message')}
            />
            <br />
            <Button disabled={isSubmitDisabled} type="submit">Сохранить</Button>
        </form>
    )
}