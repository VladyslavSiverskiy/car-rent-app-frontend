import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useAuth } from "./security/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateUserPassword } from "./api/CarApiService";

export default function UpdatePasswordComponent() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (values) => {
        values.userId = auth.userData.id;
        console.log(values);
        updateUserPassword(values).then(resp => navigate('/user/profile')).catch(err => setErrorMessage("passwords don't match"));
    }

    const validate = (values) => {
        let errors = {};
        if (!values.oldPassword) {
            errors.oldPassword = "can`t be empty";
        }
        if (!values.newPassword) {
            errors.newPassword = "can`t be empty";
        }
        if (!values.newPasswordRepeat) {
            errors.newPasswordRepeat = "can`t be empty";
        }
        return errors;
    }

    return (<div>
        <div className="container">
            <Formik initialValues={{ oldPassword, newPassword, newPasswordRepeat }}
                onSubmit={onSubmit}
                validate={validate}
                enableReinitialize={true}
            >
                {
                    (props) => (
                        <Form>
                            <fieldset className='form-group'>
                                <label>Enter your old password:</label>
                                <Field type='password' className='form-control' name='oldPassword'></Field>
                            </fieldset>
                            <ErrorMessage name='oldPassword' component='div' className='alert'></ErrorMessage>

                            <fieldset className='form-group'>
                                <label>Enter new password:</label>
                                <Field type='password' className='form-control' name='newPassword'></Field>
                            </fieldset>
                            <ErrorMessage name='newPassword' component='div' className='alert'></ErrorMessage>


                            <fieldset className='form-group'>
                                <label>Repeat new password:</label>
                                <Field type='password' className='form-control' name='newPasswordRepeat'></Field>
                            </fieldset>
                            <ErrorMessage name='newPasswordRepeat' component='div' className='alert'></ErrorMessage>
                            
                            <button className='btn btn-success mb-5' type='submit'>Update my password</button>
                     
                            {errorMessage && <div className='alert'>{errorMessage}</div>}
                        </Form>
                    )
                }
            </Formik>

        </div>
    </div>);
}