import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../security/AuthContext';

const springClient = axios.create({ baseURL: 'http://localhost:443/api/v1' });


export function retrieveCarList() {
   return springClient.get('/public/cars')
}

export function retrieveCarById(carId) {
   return springClient.get(`/public/cars/${carId}`);
}



export function checkAdminState() {
   const jwtToken = Cookies.get('jwt'); // Retrieve the JWT token from your cookies

   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };


   return springClient.get('/admin/check', config);
}

export function deleteCar(carId) {
   return springClient.delete(`/admin/cars/${carId}`, {
      headers: {
         'Authorization': 'Bearer ' + Cookies.get('jwt')
      }
   });
}

export function saveCarToDatabase(carData) {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };

   return springClient.post(`/admin/cars`, carData, config);
}

export function updateCarInDatabase(carData) {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   console.log(carData);
   return springClient.put(`/admin/cars`, carData, config);
}

//end admin 


export function signUp(signUpData) {
   return springClient.post('/public/auth/signup', signUpData, {
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
   })
}


export function signIn(signInData) {
   return springClient.post('/public/auth/login', signInData, {
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
   })
}


export const uploadCarPicture = async (formData, carId) => {
   console.log(formData);
   try {
      const jwtToken = Cookies.get('jwt');
      return springClient.post(`/admin/cars/upload/${carId}`, formData,
         {
            headers: {
               Authorization: `Bearer ${jwtToken}`,
               'Content-Type': 'multipart/form-data'
            }
         });
   } catch (e) {
      return e;
   }
}


export const downloadCarPicture = async (carId) => {
   try {
      return springClient.get(`/public/cars/${carId}/picture`);
   } catch (e) {
      throw e;
   }
}

// PAYMENT
export const payForOrder = async (orderData) => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.post(`/user/orders/create`, orderData, config);
}
/////


export const getUserProfile = async () => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.post(`/user/data`, jwtToken, config);
}


export const getUserOrders = async (userId) => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.get(`/user/orders/all/${userId}`, config);
}


export const likeCarFromTheList = async(userId, carId) => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.get(`/user/${userId}/like-car/${carId}`, config);
}

export const getAllUserLikes = async (userId) => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.get(`/user/${userId}/likes`, config);

}

export const removeLikeFromTheList = async(userId, carId) => {
   const jwtToken = Cookies.get('jwt');
   const config = {
      headers: {
         Authorization: `Bearer ${jwtToken}`
      }
   };
   return springClient.get(`/user/${userId}/like-car/${carId}/delete`, config);
}

