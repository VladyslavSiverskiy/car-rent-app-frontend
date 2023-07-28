import { Link, useNavigate } from 'react-router-dom';
import './styles/MainPage.css';
import { useEffect, useState } from 'react';
import { downloadCarPicture, retrieveCarList } from './api/CarApiService';
import Cookies from 'js-cookie';


export default function MainPageComponent() {
  const [carArr, setCarArray] = useState([]);
  useEffect(() => callRestApi(), []);
  const navigate = useNavigate();
  const [carPictures, setCarPictures] = useState({});
  useEffect(() => {
    const fetchCarPictures = async () => {
      try {
        const carPicturesPromises = carArr.map(async (car) => {
          const response = await downloadCarPicture(car.carId);
          return { carId: car.carId, pictureBytes: response.data };
        });

        const carPicturesData = await Promise.all(carPicturesPromises);
        const carPicturesObj = {};

        carPicturesData.forEach((data) => {
          carPicturesObj[data.carId] = data.pictureBytes;
        });

        setCarPictures(carPicturesObj);
      } catch (error) {
        console.error('Error fetching car pictures:', error);
      }
    };

    fetchCarPictures();
  }, [carArr]);


  function callRestApi() {
    retrieveCarList().then(response => successfulResponse(response))
      .catch(error => errorResponse(error))
  }


  function successfulResponse(response) {
    if (response != null) {
      setCarArray(response.data);

    }
  }

  function errorResponse(error) {
    console.log('error' + error);
  }

  const showCar = e => {
    const carId = e.target.getAttribute('data-car-id');
    navigate(`/cars/${carId}`);
  }

  return (<div className="main-window__section">
    <div className="main-window__car-list container">
      {carArr.map(car => {
        const byteArr = carPictures[car.carId];
        return (
          <div key={car.carId} className='main-window__car-card'>
            <div className="main-window__car-card_title">
              <div className="main-window__car-card_description">
                <div className="main-window__car-card_model">
                  {car.model}
                </div>
                <div className="main-window__car-card_category">
                  {car.categoryName}
                </div>
              </div>
              <img src={"/img/icons/like.svg"} alt='like' className="main-window__car-card_like" />
            </div>
            <img className="main-window__car-car_picture" src={`data:image/jpg;base64, ${byteArr}`} alt="car-picture"></img>
            <div className="main-window__car-card_stats">
              <div className="main-window__car-card_stat-param">
                <img src={"/img/icons/gas-station.svg"} alt="gas-station-icon" />
                <span className="main-window__car-card_fuel-consumption">{car.avgFuelConsumption}L</span>
              </div>
              <div className="main-window__car-card_stat-param">
                <img src={"/img/icons/Car.svg"} alt="gas-station-icon" />
                <span className="main-window__car-card_fuel-consumption">{car.gearboxType}</span>
              </div>
              <div className="main-window__car-card_stat-param">
                <img src={"/img/icons/profile-2user.svg"} alt="gas-station-icon" />
                <span className="main-window__car-card_fuel-consumption">{car.seatsCount} People</span>
              </div>
            </div>
            <div className="main-window__car-rent">
              <div className="main-window__car-rent_price">
                <p className="main-window__car-card_model">
                  ${car.dayRentalPrice}/
                </p>
                <p className="main-window__car-card_category">
                  day
                </p>
              </div>
              <button className='main-window__car-rent_button' onClick={showCar} data-car-id={car.carId}>
                Rent car
              </button>
            </div>
          </div>)
      })}
    </div>
  </div>)
}