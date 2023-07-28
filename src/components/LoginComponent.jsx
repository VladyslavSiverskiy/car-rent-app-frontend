import { Formik, Form, Field, ErrorMessage } from 'formik';
import './styles/CarRentalApp.css';
import './styles/Forms.css';
import { signIn, signUp } from './api/CarApiService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './security/AuthContext';
import Cookies from 'js-cookie';

export default function LoginComponent() {
    let email = ''; 
    let password = '';
    
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    function onSubmit(values) {
        const dataToSend = {
            email: values.email,
            password: values.password
        }

        signIn(dataToSend)
            .then(resp => {
                if (resp.data != null || resp.data != undefined) {
                    successLogin(resp.data.jwt)
                }
            })
            .catch(err => loginFailed(err));
    }

    function validate(values) {
        let errors = {};
        if (values.email.length < 10) {
            errors.email = 'Short email';
        }

        return errors;
    }

    function successLogin(jwtToken) {
        setAuthError('');
        auth.setJwtToken(jwtToken);
        auth.setAuthenticated(true);
        Cookies.set('jwt', jwtToken);
        auth.checkAdmin();
        navigate("/");
    }

    function loginFailed(err) {
        setAuthError(err.message);
        navigate("/login");
    }


    return (<div className="container">
        <Formik initialValues={{ email, password }}
            enableReinitialize={true} onSubmit={onSubmit}
            validate={validate}
        >
            {
                (props) => (
                    <Form className='auth-form'>
                        
                        {authError != '' && <div className='alert'>{authError}</div>}
                        <ErrorMessage name='email' component='div' className='alert'></ErrorMessage>
                        <ErrorMessage name='password' component='div' className='alert'></ErrorMessage>
                        <h2 className="car-add_header">Sign in</h2>
                        <fieldset className='form-group'>
                            <label>Email:</label>
                            <Field type='text' className='form-control' name='email' />
                        </fieldset>

                        <fieldset className='form-group'>
                            <label>Password</label>
                            <Field type='password' className='form-control' name='password'></Field>
                        </fieldset>
                        <div>
                            <button className='btn btn-succes' type='submit'>Sign in</button>
                        </div>
                    </Form>
                )
            }
        </Formik>
    </div>);
}