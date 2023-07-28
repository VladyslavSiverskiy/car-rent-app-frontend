import { Formik, Form, Field, ErrorMessage } from 'formik';
import './styles/CarRentalApp.css';
import './styles/Forms.css';
import { signUp } from './api/CarApiService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './security/AuthContext';
import { useState } from 'react';

export default function SignUpComponent(){
    const navigate = useNavigate();
    const auth = useAuth()

    const [authError, setAuthError] = useState('');

    let email = ''; //зробити так з даними машини при оновленні
    let password = ''; //зробити так з даними машини при оновленні
    let firstName = '';
    let lastName = '';
    let phone = '';

    function onSubmit(values){
       const dataToSend = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phone
        }

        signUp(dataToSend)
            .then(resp => successRegistration(resp.data.jwt))
            .catch(err => registrationFailed(err));  
    }

    function validate(values){
        let errors = {};
        const passwordRegex = /^(?=.*[a-z]).{8,20}$/;
        const emailRegex = /^(.+)@(\S+)$/;

        if(values.email.length < 10 || !emailRegex.test(values.email)){
            errors.email = 'Wrong email format';
        }

        if(!passwordRegex.test(values.password)){
            errors.password = 'Password must contain letters, length should be from 8 to 20'
        }
        return errors;
    }


    function successRegistration(jwtToken){
            setAuthError('');    
            auth.setJwtToken(jwtToken);
            auth.setAuthenticated(true);
            Cookies.set('jwt', jwtToken);
            auth.checkAdmin();
            navigate("/");
    }

    function registrationFailed(err){
        setAuthError(err.response.data.info);
        navigate("/signup");
    }

    return (<div className="container">
        <Formik initialValues={{email, password, firstName, lastName, phone}} 
                enableReinitialize={true} onSubmit={onSubmit}
                validate={validate}
                >
        {
            (props) => ( 
                <Form className='auth-form sign-up-form'>
                    {authError != '' && <div className='alert'>{authError}</div>}
                    <ErrorMessage name='email' component='div' className='alert'></ErrorMessage>
                    <ErrorMessage name='password' component='div' className='alert'></ErrorMessage>
                    <fieldset className='form-group'>
                        <label>First Name</label>
                        <Field type='text' className='form-control' name='firstName'/>
                    </fieldset>
                    <fieldset className='form-group'>
                        <label>Last Name</label>
                        <Field type='text' className='form-control' name='lastName'/>
                    </fieldset>

                    <fieldset className='form-group'>
                        <label>Email</label>
                        <Field type='text' className='form-control' name='email'/>
                    </fieldset>
                    
                    <fieldset className='form-group'>
                        <label>Password</label>
                        <Field type='password' className='form-control' name='password'></Field>
                    </fieldset>
              

                    <fieldset className='form-group'>
                        <label>Phone</label>
                        <Field type='text' className='form-control' name='phone'/>
                    </fieldset>
                    <div>
                        <button className='btn btn-succes' type='submit'>Sign up</button>
                    </div>
                </Form>
                )
        }
        </Formik>
    </div>);
}