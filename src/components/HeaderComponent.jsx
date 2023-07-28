import { Link } from "react-router-dom";
import './styles/Header.css';
import { useState } from "react";
import { useAuth } from "./security/AuthContext";


function ProfileModalComponent() {
    return (<div className="profile-modal">
        <Link className="profile-modal__menu-item" to="/likes">Likes</Link>
        <Link className="profile-modal__menu-item" to="/notifications">Notifications</Link>
        <Link className="profile-modal__menu-item" to="/stats">Statistics</Link>
        <Link className="profile-modal__menu-item" to="/settings">Profile settings</Link>
        <Link className="profile-modal__menu-item" to="/logout">Logout</Link>
    </div>)
}



function BurgerMenuComponent() {
    const [isActive, setIsActive] = useState(false)
    function openBurger() {
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
        setIsActive(!isActive);
    }


    function closeModal(setIsActive) {

        // console.log(setIsActive);
        // console.log('hEl');
        // const element = document.querySelector("mobile-menu");
        // element.classList.add('hide');
        // console.log(element);
        // setIsActive(false);
    }

    return (
        <>
            <div className="burger__selector" onClick={openBurger}>
                <div className={`burger__selector-central-line ${isActive ? 'active-burger' : ''}`}></div>
            </div>
            <div className={`mobile-menu ${isActive ? '' : 'hide'}`}>
                <UserProfileComponent value={{ isActive }} closeModal={{ closeModal }}></UserProfileComponent>
            </div>
        </>)
}


function UserProfileComponent({ value, closeModal }) {
    const auth = useAuth();
    let isAuthenticated = auth.isAuthenticated;
    const [isProfileModalShown, setProfileModalShown] = useState(false);

    function changeModalState() {
        setProfileModalShown(!isProfileModalShown);
    }


    console.log(closeModal);
    function handleLinkClick() {
        if (closeModal != undefined) {
            const element = document.querySelector(".mobile-menu");
            element.classList.add('hide');
            const burger = document.querySelector(".burger__selector-central-line");
            burger.classList.remove('active-burger');
            document.body.style.overflow = 'auto';
        }
    }


    if (isAuthenticated) {
        return (
            <div className='header__user-tools'>
                <div className="header__user-tool_likes">
                    <img src={"/img/icons/heart.svg"} alt='likes' />
                </div>
                <div className="header__user-tool_likes">
                    <img src={"/img/icons/notifications.svg"} alt='messages' />
                </div>
                <div className="header__user-tool_likes">
                    <img src={"/img/icons/settings.svg"} alt='settings' />
                </div>
                <div onMouseEnter={changeModalState} className="header__user-tool_likes">
                    <img src={"/img/icons/profil.png"} alt='profile' />
                </div>

                {isProfileModalShown && <ProfileModalComponent></ProfileModalComponent>}
                {value != undefined && closeModal != undefined && value.isActive && <div className="profile-modal-mobile">
                    <Link onClick={handleLinkClick} className="profile-modal-mobile__menu-item" to="/likes">Likes</Link>
                    <Link onClick={handleLinkClick} className="profile-modal-mobile__menu-item" to="/notifications">Notifications</Link>
                    <Link onClick={handleLinkClick} className="profile-modal-mobile__menu-item" to="/stats">Statistics</Link>
                    <Link onClick={handleLinkClick} className="profile-modal-mobile__menu-item" to="/settings">Profile settings</Link>
                    <Link onClick={handleLinkClick} className="profile-modal-mobile__menu-item" to="/logout">Logout</Link>
                </div>}
            </div>
        )
    } else {
        return (
            <div className='header__auth-tools'>
                <Link onClick={handleLinkClick} className="header__auth-link" to="/login">Sign In</Link>
                <Link onClick={handleLinkClick} className="header__auth-link" to="/signup">Sign Up</Link>
            </div>
        )
    }
}

export default function HeaderComponent() {
    return (
        <header>
            <div className="container header-wrapper">
                <div>
                    <Link className="header__logo" to="/">RENTAL</Link>
                </div>
                <BurgerMenuComponent></BurgerMenuComponent>
                <UserProfileComponent></UserProfileComponent>
            </div>
        </header>
    )
}