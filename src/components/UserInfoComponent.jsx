import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./security/AuthContext";
import './styles/UserProfile.css';
import { useDropzone } from "react-dropzone";
import { downloadUserAvatar, updateUserProfile, uploadUserAvatar } from "./api/CarApiService";
import { useNavigate } from "react-router-dom";

export default function UserInfoComponent() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState()
    const [phoneNumber, setPhoneNumber] = useState();

    const [userAvatar, setUserAvatar] = useState();
    // const [file, setFile] = useState();
    let errorMessage;



    useEffect(() => {
        setFirstName(auth.userData.firstName);
        setLastName(auth.userData.lastName);
        setEmail(auth.userData.email);
        setPhoneNumber(auth.userData.phoneNumber);

        downloadUserAvatar(auth.userData.id).then(resp => {
            if (resp.data != null) {
                setUserAvatar(resp.data);
            }
        }).catch(err => console.log(err));
    }, [auth.userData]);




    const onSubmit = (values) => {
        values.id = auth.userData.id;
        values.password = auth.userData.password;
        values.role = auth.userData.role;
        console.log(values);
        updateUserProfile(values)
            .then(resp => {
                setFirstName(resp.data.firstName);
                setLastName(resp.data.lastName);
                setEmail(resp.data.email);
                setPhoneNumber(resp.data.phoneNumber);
            })
            .catch(err => console.log(err));
    }

    const validate = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.firstName = 'First name is required';
        }

        if (!values.lastName) {
            errors.lastName = 'Last name is required';
        }

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        }

        return errors;
    }



    function UserAvatarComponent() {
        if (!userAvatar) {
            return <img className="user-avatar_picture" src={"/img/icons/profil.png"} alt="profile"></img>
        }
        return <img className="user-avatar_picture" src={`data:image/jpg;base64, ${userAvatar}`} alt="profile"></img>
    }

    function UserAvatarDropzone() {
        const onDrop = useCallback(acceptedFiles => {
            let selectedFile = acceptedFiles[0];
            const formData = new FormData();
            formData.append('file', selectedFile);
            uploadUserAvatar(formData, auth.userData.id);
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                let binary = '';
                for (let i = 0; i < byteArray.length; i++) {
                    binary += String.fromCharCode(byteArray[i]);
                }
                const base64String = window.btoa(binary);
                setUserAvatar(base64String);
            };
            reader.readAsArrayBuffer(selectedFile);


        }, [])
        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

        return (
            <div className="dropzone-avatar" {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>+</p> :
                        <p>+</p>
                }
            </div>
        )
    }

    const passwordChange = () => {
        navigate('/user/profile/password');
    }

    return <div className="container">
        <div className="profile-settings">
            <div className="avatar-component">
                <UserAvatarComponent></UserAvatarComponent>
                <UserAvatarDropzone></UserAvatarDropzone>
            </div>
            <Formik initialValues={{ firstName, lastName, email, phoneNumber }}
                onSubmit={onSubmit}
                validate={validate}
                enableReinitialize={true}
            >
                {
                    (props) => (
                        <Form className="profile-form">
                            <fieldset className='form-group'>
                                <label>First name:</label>
                                <Field type='text' className='form-control' name='firstName' />
                            </fieldset>
                            <ErrorMessage name='firstName' component='div' className='alert'></ErrorMessage>
                            <fieldset className='form-group'>
                                <label>Last name:</label>
                                <Field type='text' className='form-control' name='lastName' />
                            </fieldset>
                            <ErrorMessage name='lastName' component='div' className='alert'></ErrorMessage>

                            <fieldset className='form-group'>
                                <label>Email:</label>
                                <Field type='email' className='form-control' name='email' />
                            </fieldset>
                            <ErrorMessage name='email' component='div' className='alert'></ErrorMessage>


                            <fieldset className='form-group'>
                                <label>Phone number:</label>
                                <Field type='tel' className='form-control' name='phoneNumber' />
                            </fieldset>
                            <ErrorMessage name='phoneNumber' component='div' className='alert'></ErrorMessage>
                            <div>
                                <button className='btn btn-success mb-5' type='submit'>Update my profile</button>
                            </div>
                            {errorMessage && <div className='alert'>{errorMessage}</div>}
                        </Form>
                    )
                }
            </Formik>

        </div>

        <div>
            <button onClick={passwordChange} className="btn btn-success mb-5">Change password</button>
        </div>
    </div>
}