import { Link, useNavigate, useParams } from 'react-router-dom';
import './styles/CarStyles.css';
import './styles/OrderWindow.css';
import { useEffect, useState } from 'react';
import { downloadCarPicture, retrieveCarById } from './api/CarApiService';
import { useAuth } from './security/AuthContext';
import { DatePicker } from '@mui/x-date-pickers';

export default function CarComponent() {
    const params = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    console.log(auth.isAuthenticated);
    const [carData, setCarData] = useState({});
    const [mainPicture, setMainPicture] = useState(null);
    const [orderWindowOpened, setOrderWindowOpened] = useState(false);


    useEffect(() => {
        if (params.carId) {
            retrieveCarById(params.carId)
                .then((resp) => {
                    setCarData(resp.data);
                })
                .catch((error) => {
                    console.log('Error fetching car data: ', error);
                });
            downloadCarPicture(params.carId)
                .then(resp => setMainPicture(resp.data))
                .catch(err => console.log(err));

        }
    }, [params.carId]);

    const redirectToLogin = (e) => {
        navigate('/login');
    }

    const openOrderWindow = () => {
        setOrderWindowOpened(true);
    }

    return (
        <div className="container">
            <div className="car-window__section">
                <div className="car-window__pictures">
                    <div className="car-window__pictures_main-part">
                        <img className="car-window__main-picture" src={`data:image/jpg;base64, ${mainPicture}`} alt="car-picture"></img>
                    </div>
                    <div className="car-window__other-pictures">
                        <img className="car-window__main-picture" src={`data:image/jpg;base64, ${mainPicture}`} alt="car-picture"></img>
                        <img className="car-window__main-picture" src={`data:image/jpg;base64, ${mainPicture}`} alt="car-picture"></img>
                        <img className="car-window__main-picture" src={`data:image/jpg;base64, ${mainPicture}`} alt="car-picture"></img>
                    </div>
                </div>
                <div className="car-window__description">
                    <div className="car-window__description_title">
                        <h1 className="car-window__description_header">{carData.model}</h1>
                        <div className="car-window__description-ratings">
                            <img src="/img/star.png" alt="starts" className="car-window__description-ratings_stars" />
                            <div className="car-window__description-ratings_count">
                                440+ Reviewer
                            </div>
                        </div>
                    </div>
                    <div className="car-window__description_content">
                        {carData.description}
                    </div>
                    <div className="car-window__description_features">
                        <div className="car-window__description_feature">
                            <div className="grid_cell">
                                <h4 className="car-window__description_feature-name">
                                    Type car
                                </h4>
                                <h4 className="car-window__description_feature-value">
                                    {carData.categoryName}
                                </h4>
                            </div>
                            <div className="grid_cell">
                                <h4 className="car-window__description_feature-name">
                                    Steering
                                </h4>
                                <h4 className="car-window__description_feature-value">
                                    {carData.gearboxType}
                                </h4>
                            </div>
                            <div className="grid_cell">
                                <h4 className="car-window__description_feature-name">
                                    Capacity
                                </h4>
                                <h4 className="car-window__description_feature-value">
                                    {carData.seatsCount} Person
                                </h4>
                            </div>
                            <div className="grid_cell">
                                <h4 className="car-window__description_feature-name">
                                    {carData.fuelType}
                                </h4>
                                <h4 className="car-window__description_feature-value">
                                    {carData.avgFuelConsumption}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="car-window__rent">
                        <div className="car-window_price-block">
                            <div className="car-window__day-rental-price">
                                ${carData.dayRentalPrice}/
                            </div>
                            <div className="car-window__day-rental-price_days">
                                days
                            </div>
                        </div>
                        {auth.isAuthenticated ? (
                        <button className="main-window__car-rent_link" onClick={openOrderWindow}>
                            Rent car
                        </button>
                        ) : (
                        <p className='car-window__car-rent_sign-in' onClick={redirectToLogin}>Please sign in to rent a car.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="car-window__reviews">
                <div className="reviews_stats">
                    <h2 className='car-window__reviews_title'>Reviews</h2>
                    <div className="car-window__reviews_amount">13</div>
                </div>
                <div className="car-window__review_description">
                    <div className="car-window__reviews_reviewer">
                        <img src="/img/icons/profil.png" alt="ava" className="car-window__reviews_reviewer-avatar"/>
                        <div className="car-window__reviews_reviewer-initials">
                            Alex Santon
                        </div>
                    </div>
                    <div className="car-window__review_info">
                        <h3 className="review_date">21 june 2023</h3>
                        <img src="/img/star.png" alt="starts" className="car-window__description-ratings_stars" />
                    </div>
                </div>
                <div className="car-window__review_content">
                We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.
                </div>
            </div>
            {orderWindowOpened && 
            <div className="order-window">
                <div className="order-window__content"></div>
            </div>}
        </div>)
}