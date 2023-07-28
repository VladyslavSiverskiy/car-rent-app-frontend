import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminState, signUpRequest } from "../api/CarApiService";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

//2.Share context
export function AuthProvider({children}){ // childern - всі компоненти всередині AuthProvider
    //3.Set state in the context
    const [isAuthenticated, setAuthenticated] = useState(false); 
    const [jwtToken, setJwtToken] = useState("");
    const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin'));
    useEffect(() => getToken(), []); 
    
    async function checkAdmin(){
        if((await checkAdminState()).status == 200){
            setIsAdmin(true);
            Cookies.set('isAdmin', true)
        }else{
            Cookies.set('isAdmin', false);
            setIsAdmin(false);
        }
    }

    function getToken(){
        const token = Cookies.get('jwt');
        if(token != undefined){
            setAuthenticated(true);
            setJwtToken(token)
        }
    }

    // function login(username, password){
    //     if(username === 'admin' && password === 'admin'){
    //         setAuthenticated(true);
    //         return true;
    //     }else{
    //         setAuthenticated(false);
    //         return false;
    //     }
    // }

    function logout(){    
        setAuthenticated(false);
        setIsAdmin(false);
        Cookies.remove('jwt', { path: '/' })
        Cookies.remove('isAdmin', { path: '/' })
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, setAuthenticated, logout, jwtToken, setJwtToken, isAdmin, checkAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}