import { useAuth } from "./security/AuthContext"
import './styles/CarRentalApp.css'

export default function LogoutComponent(){
    const auth = useAuth();
    auth.logout();
    
    return (<div className="logout">You logged out successfully!</div>)
}