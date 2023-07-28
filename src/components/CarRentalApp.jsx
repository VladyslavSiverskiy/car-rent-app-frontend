import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './styles/CarRentalApp.css';
import HeaderComponent from "./HeaderComponent";
import MainPageComponent from "./MainPageComponent";
import FooterComponent from "./FooterComponent";
import CarComponent from "./CarComponent";
import { AuthProvider, useAuth } from "./security/AuthContext";
import AdminMainPageComponent from "./AdminMainPageComponent";
import LogoutComponent from "./LogoutComponent";
import LoginComponent from "./LoginComponent";
import AddCarComponent from "./AddCarComponent";
import SignUpComponent from "./SignUpComponent";
import { checkAdminState, retrieveCarList } from "./api/CarApiService";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";


function AuthenticatedRoute({ children }) {
    const auth = useAuth();
    if (auth.isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/"></Navigate>
    }
}


function AdminAuthenticatedRoute({ children }) {
    const auth = useAuth();
    if (auth.isAdmin) {
        return children;
    } else {
        return <AccessForbiddenComponent></AccessForbiddenComponent>;
    }
}

function TestComponent() {
    return (<div>Can rent!</div>)
}


function AccessForbiddenComponent() {
    return <div>403 Access Forbidden</div>
}


export default function CarRentalApp() {
    return (<div className="wrap">
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent></HeaderComponent>
                    <Routes>
                        <Route path='/' element={<MainPageComponent></MainPageComponent>}></Route>
                        <Route path='/cars/:carId' element={<CarComponent></CarComponent>}></Route>
                        <Route path='/cars/:carId/rent' element={
                            <AuthenticatedRoute>
                                <TestComponent></TestComponent>
                            </AuthenticatedRoute>}>
                        </Route>

                        <Route path='/admin/cars' element={
                            <AdminAuthenticatedRoute>
                                <AdminMainPageComponent></AdminMainPageComponent>
                            </AdminAuthenticatedRoute>
                        }
                        ></Route>
                         <Route path='/admin/cars/:carId' element={
                            <AdminAuthenticatedRoute>
                                <AddCarComponent></AddCarComponent>
                            </AdminAuthenticatedRoute>
                        }
                        ></Route>
                      
                        <Route path='/admin/cars/new' element={
                            <AdminAuthenticatedRoute>
                                <AddCarComponent></AddCarComponent>
                            </AdminAuthenticatedRoute>
                        }></Route>
                        <Route path="/login" element={<LoginComponent></LoginComponent>}></Route>
                        <Route path="/signup" element={<SignUpComponent></SignUpComponent>}></Route>
                        <Route path='/logout' element={<LogoutComponent></LogoutComponent>}></Route>
                    </Routes>
                    <FooterComponent></FooterComponent>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    </div>);
}