import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../Services/AuthService';

export const AuthContext = createContext();

export default ({ children }) => {

    // React usetState hooks to keep track of the account logged in, if they are authenticated, and if they have been loaded.
    const [account, setAccount] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // React useEffect to check if account is already authenticated on pageload
    useEffect(() => {
        AuthService.isAuthenticated().then(data => {
            setAccount(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        })
    }, []);

    return (
        <div>
            {!isLoaded ? <h1>Loading</h1> : <AuthContext.Provider value = {{account, setAccount, isAuthenticated, setIsAuthenticated}}>{children}</AuthContext.Provider>}
        </div>
    );
}