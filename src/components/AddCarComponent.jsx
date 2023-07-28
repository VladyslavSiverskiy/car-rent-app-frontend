import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import './styles/Forms.css';
import './styles/CarAdd.css'
import './styles/CarRentalApp.css'
import { useDropzone } from "react-dropzone";
import { downloadCarPicture, retrieveCarById, saveCarToDatabase, updateCarInDatabase, uploadCarPicture } from "./api/CarApiService";
import ModalWindowComponent from "./ModalWindowComponent";
import ErrorBoundary from "./ErrorBoundary";
import { useNavigate, useParams } from "react-router-dom";

export default function AddCarComponent() {
    const params = useParams();
    const navigate = useNavigate();
    let pictureWasChanged = false;
    const [file, setFile] = useState(null);

    const [modalMessage, setModalMessage] = useState('');
    const [isModalShown, setModalShown] = useState(false);
    const [formError, setFormError] = useState('');
    const [formErrorCategories, setFormErrorCategories] = useState('');


    const [description, setDescription] = useState('');
    const [model, setModel] = useState('');
    const [seatsCount, setSeatsCount] = useState(0);
    const [volume, setVolume] = useState(0.00);
    const [avgFuelConsumption, setAvgFuelConsumption] = useState(0.00);
    const [carImg, setCarImg] = useState(null);
    const [manufacturingYear, setManufacturingYear] = useState(0);
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);

    const categories = [
        { value: 'SUV', label: 'SUV' },
        { value: 'BUSINESS', label: 'Business' },
        { value: 'COMFORT', label: 'Comfort' },
        { value: 'ECONOMY', label: 'Economy' }
    ];

    const gearTypes = [
        { value: 'MANUAL', label: 'Manual' },
        { value: 'AUTOMATIC', label: 'Automatic' }
    ];

    const fuelTypes = [
        { value: 'DIESEL', label: 'Diesel' },
        { value: 'PETROL', label: 'Petrol' },
        { value: 'ELECTRIC', label: 'Electric' }
    ];

    const inStock = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ];

    const [defaultCategory, setDefaultCategory] = useState({ value: '', label: 'Select Category' });
    const [defaultGearType, setDefaultGearType] = useState({ value: '', label: 'Select Gear Type' });
    const [defaultFuelType, setDefaultFuelType] = useState({ value: '', label: 'Select Fuel Type' });
    const [defaultInStock, setDefaultInStock] = useState({ value: '', label: 'Select Availability' });

    useEffect(() => {
        if (params.carId) {
            retrieveCarById(params.carId)
                .then((resp) => {
                    const data = resp.data;
                    setModel(data.model);
                    setDescription(data.description);
                    setDefaultCategory({ value: data.categoryName, label: data.categoryName });
                    setDefaultGearType({ value: data.gearboxType, label: data.gearboxType });
                    setDefaultFuelType({ value: data.fuelType, label: data.fuelType });
                    setSeatsCount(data.seatsCount);
                    setVolume(data.engineVolume);
                    setAvgFuelConsumption(data.avgFuelConsumption);
                    setManufacturingYear(data.yearOfManufacturing);
                    setPrice(data.dayRentalPrice);
                    setDefaultInStock({ value: data.inStock, label: data.inStock == true ? "Yes" : "No" });
                    setLocation(data.locationInfo);
                })
                .catch((error) => {
                    console.log('Error fetching car data: ', error);
                });
            downloadCarPicture(params.carId)
                .then(resp => setCarImg(resp.data))
                .catch(err => console.log(err));

        }
    }, [params.carId]);

    function CarImageDropzone() {
        const onDrop = useCallback(acceptedFiles => {
            let selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                let binary = '';
                for (let i = 0; i < byteArray.length; i++) {
                    binary += String.fromCharCode(byteArray[i]);
                }
                const base64String = window.btoa(binary);
                setCarImg(base64String);
            };
            reader.readAsArrayBuffer(selectedFile);
            pictureWasChanged = true;

            //TODO: do it only after click
            // const formData = new FormData();
            // formData.append('file', acceptedFiles[0]);
            // uploadCarPicture(formData)
            //     .then(res => console.log('success, picture uploaded'))
            //     .catch(err => console.log(err));
        }, [])
        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

        return (
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some picture here, or click to select picture</p>
                }
            </div>
        )
    }

    // const [carPicture, setCarPicture] = useState('/');
    // downloadCarPicture().then(resp => setCarPicture(resp.data)).catch(e => console.log(e));
    // console.log(carPicture);
    function onSubmit(values) {
        console.log(values);
        const dataToSend = {
            model: values.model,
            description: values.description,
            categoryName: values.category,
            gearboxType: values.gearType,
            seatsCount: values.seatsCount,
            engineVolume: values.volume,
            fuelType: values.fuelType,
            avgFuelConsumption: values.avgFuelConsumption,
            yearOfManufacturing: values.manufacturingYear,
            dayRentalPrice: values.price,
            inStock: values.inStock,
            locationInfo: values.location
        };
        setModalMessage("Sending data...");
        setModalShown(true);

        if (params.carId) {// to update
            // console.log(dataToSend);
            dataToSend.carId = params.carId;
            updateCarInDatabase(dataToSend)
                .then(resp => {
                    if (pictureWasChanged) {
                        setModalMessage("Saving photo...");
                        const formData = new FormData();
                        formData.append('file', file);

                        uploadCarPicture(formData, params.carId)
                            .then(res => {
                                setModalMessage("Car was successfully updated!")
                                function closeModal() {
                                    setModalMessage(null);
                                    setModalShown(false);
                                    navigate('/admin/cars');
                                }
                                setTimeout(closeModal, 1000);
                            }).catch(err => {
                                console.log(err)
                                setFormError(err)
                            });
                    }else{
                        setModalMessage("Car was successfully updated!")
                                function closeModal() {
                                    setModalMessage(null);
                                    setModalShown(false);
                                    navigate('/admin/cars');
                                }
                                setTimeout(closeModal, 1000);
                    }
                })
                .catch(err => setFormError(err))
        } else { // to save
            saveCarToDatabase(dataToSend)
                .then(resp => {
                    let carId = resp.data.carId;

                    setModalMessage("Saving photo...");
                    const formData = new FormData();
                    formData.append('file', file);

                    uploadCarPicture(formData, carId)
                        .then(res => {
                            setModalMessage("Car was successfully saved!")
                            function closeModal() {
                                setModalMessage(null);
                                setModalShown(false);
                                navigate('/admin/cars');
                            }
                            setTimeout(closeModal, 1000);
                        }).catch(err => {
                            console.log(err)
                            setFormError(err)
                        });
                }).catch(err => {
                    console.log(err)
                    setFormError(err)
                });

        }
    }


    function validate(values) {
        let errors = {};

        if (!carImg) {
            errors.picture = 'Add car picture!';
            setFormError(errors.picture);
        } else {
            setFormError('');
        }

        if (!values.category || !values.fuelType || !values.inStock || !values.gearType) {
            errors.select = 'Choose options in selects';
            setFormErrorCategories(errors.select);
        } else {
            setFormErrorCategories('');
        }


        if (values.model === '') {
            errors.model = 'Car model can`t be empty';
        }
        return errors;

    }

    const renderSelectOptions = (options) => {
        return options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
    };

    function CarImageComponent() {
        if (carImg == null) {
            return <img className="car-add_picture" src={"/img/blank.jpg"} alt="car-picture"></img>
        }
        return <img className="car-add_picture" src={`data:image/jpg;base64, ${carImg}`} alt="car-picture"></img>
    }

    return (
        <div className="container car-add__section">
            {isModalShown && <ModalWindowComponent message={modalMessage}></ModalWindowComponent>}
            <h2 className="car-add_header">Add car to database</h2>
            <CarImageComponent></CarImageComponent>
            <div className="car-image_drop-zone">
                <h1 className="car-add_header">Add car picture</h1>
                <CarImageDropzone></CarImageDropzone>
            </div>
            <Formik initialValues={{ description, model, seatsCount, volume, avgFuelConsumption, manufacturingYear, price, location }}
                onSubmit={onSubmit}
                validate={validate}
                enableReinitialize={true}
            >
                {
                    (props) => (
                        <Form>
                            <fieldset className='form-group'>
                                <label>Model:</label>
                                <Field type='text' className='form-control' name='model' />
                            </fieldset>
                            <ErrorMessage name='model' component='div' className='alert'></ErrorMessage>
                            <fieldset className='form-group'>
                                <label>Category:</label>
                                <Field as="select" className='form-control' name='category'>
                                    <option value={defaultCategory.value}>{defaultCategory.label}</option>
                                    {renderSelectOptions(categories)}
                                </Field>
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Description:</label>
                                <Field as="textarea" className='form-control' name='description' id='description' />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Gear type:</label>
                                <Field as="select" className='form-control' name='gearType'>
                                    <option value={defaultGearType.value}>{defaultGearType.label}</option>
                                    {renderSelectOptions(gearTypes)}
                                </Field>
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Seats count:</label>
                                <Field type='text' className='form-control' name='seatsCount' />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Engine volume:</label>
                                <Field type='text' className='form-control' name='volume' placeholder="2.0" />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Fuel type:</label>
                                <Field as="select" className='form-control' name='fuelType'>
                                    <option value={defaultFuelType.value}>{defaultFuelType.label}</option>
                                    {renderSelectOptions(fuelTypes)}
                                </Field>
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Average fuel consumption:</label>
                                <Field type='text' className='form-control' name='avgFuelConsumption' placeholder="7.5" />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Year of manufacturing:</label>
                                <Field type='text' className='form-control' name='manufacturingYear' placeholder="2020" />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Rental price per day $:</label>
                                <Field type='text' className='form-control' name='price' placeholder="20.5" />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Location:</label>
                                <Field type='text' className='form-control' name='location' />
                            </fieldset>
                            <fieldset className='form-group'>
                                <label>Is in stock?:</label>
                                <Field as="select" className='form-control' name='inStock'>
                                    <option value={defaultInStock.value}>{defaultInStock.label}</option>
                                    {renderSelectOptions(inStock)}
                                </Field>
                            </fieldset>
                            {formError != '' && <div className='alert'>{formError}</div>}
                            {formErrorCategories != '' && <div className='alert'>{formErrorCategories}</div>}
                            <div>
                                {!params.carId && <button className='btn btn-success' type='submit'>Add car to database</button>}
                                {params.carId && <button className='btn btn-success' type='submit'>Update car</button>}
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>);
}