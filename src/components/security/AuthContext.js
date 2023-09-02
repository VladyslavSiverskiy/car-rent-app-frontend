import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminState, getUserProfile, signUpRequest } from "../api/CarApiService";
import Cookies from "js-cookie";
import { useStateWithCallbackLazy } from "use-state-with-callback";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

//2.Share context
export function AuthProvider({children}){ // childern - всі компоненти всередині AuthProvider
    //3.Set state in the context
    // 
    // const cookiesUserData = await getUserProfile();
    // const userDataInitialyState = cookiesUserData ? JSON.parse(cookiesUserData) : null; 
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(false); 
    const [jwtToken, setJwtToken] = useState("");
    const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin'));
   
    function saveUserProfile(){
        getUserProfile(jwtToken)
            .then(response => setUserData(response.data))
            .catch(err => console.log(err));
    }


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

    function logout(){    
        setAuthenticated(false);
        setIsAdmin(false);
        setUserData(null);
        console.log("DELETE");
        Cookies.remove('jwt', { path: '/' });
        Cookies.remove('isAdmin', { path: '/' });
        // Cookies.remove('userData', { path: '/'});
    }

    if(!userData && isAuthenticated){
        saveUserProfile();
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, setAuthenticated, logout, saveUserProfile, jwtToken, setJwtToken, isAdmin, checkAdmin, userData, setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}