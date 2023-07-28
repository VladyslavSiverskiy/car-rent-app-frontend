import { Link, useNavigate } from 'react-router-dom';
import './styles/MainPage.css';
import './styles/Admin.css';

import { useEffect, useState } from 'react';
import { deleteCar, downloadCarPicture, retrieveCarList } from './api/CarApiService';
import ModalWindowComponent from './ModalWindowComponent';


export default function AdminMainPageComponent() {


  const [modalMessage, setModalMessage] = useState('');
  const [isModalShown, setModalShown] = useState(false);

 
  const [carArr, setCarArray] = useState([]);
  useEffect(() => callRestApi(), []);
  

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

  const navigate = useNavigate();

  function openAddComponent() {
    navigate('/admin/cars/new');
  }

  const editCar = e => {
      const carId = e.target.getAttribute('data-car-id');
      navigate(`/admin/cars/${carId}`);
  }

  const deleteCarFromDatabase = e => {
    const carId = e.target.getAttribute('data-car-id');
    deleteCar(carId);
    setModalMessage(`Car with id ${carId} was successfully saved!`);
    setModalShown(true);
    function closeModal() {
      setModalMessage(null);
      setModalShown(false);
      navigate('/admin/cars');
    }
    setTimeout(closeModal, 1000);
    navigate("/admin/cars")
  }

  return (<div className="main-window__section">
    {isModalShown && <ModalWindowComponent message={modalMessage}></ModalWindowComponent>}
    <div className="admin__car-list_tools container">
      <button className='main-window__car-rent_button admin-add' onClick={openAddComponent}>
        Add car
      </button>
    </div>
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
            <div className="main-window__car-rent admin_car-rent">
              <div className="main-window__car-rent_price">
                {/* on admin page we display car id instead of rent price*/}
                <p className="main-window__car-card_model">
                  #{car.carId}
                </p>
              </div>
              <button className='main-window__car-rent_button admin-edit' onClick={editCar} data-car-id={car.carId}>
                Edit car
              </button>

              <button className='main-window__car-rent_button admin-delete' onClick={deleteCarFromDatabase} data-car-id={car.carId}>
                Delete car
              </button>

            </div>
          </div>)
      })}
    </div>
  </div>)
}