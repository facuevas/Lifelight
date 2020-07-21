import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';

// Styles
import '../styles/Navbar.css';

const Navbar = props => {
    const { isAuthenticated, account, setIsAuthenticated, setAccount } = useContext(AuthContext);

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if (data.success) {
                setAccount(data.account);
                setIsAuthenticated(false);
            }
        })
    };

    const unauthenticatedNavbar = () => {
        return(
            <>
                <Link to="/">
                    <li className="nav-item nav-link">Home</li>
                </Link>
                <Link to="/login">
                    <li className="nav-item nav-link">Login</li>
                </Link>                
                <Link to="/register">
                    <li className="nav-item nav-link">Register</li>
                </Link>
            </>
        );
    };

    const authenticatedNavbar = () => {
        return(
            <>
                <Link to="/feed">
                    <li className="nav-item nav-link">My Feed</li>
                </Link>
                <Link to="/lifelights">
                    <li className="nav-item nav-link">My Lifelights</li>
                </Link>
                <button type ="button"
                        className="btn btn-link nav-item nav-link"
                        onClick={onClickLogoutHandler}>
                            Logout
                </button>
            </>
        );
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav" id="navbarText">
                    { !isAuthenticated ? unauthenticatedNavbar() : authenticatedNavbar()}
                </ul>
            </div>
        </nav>
    );

}

export default Navbar;