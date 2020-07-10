import React, { useState, useContext } from 'react';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';
import Message from '../Components/Message';

const Login = props => {
    const [account, setAccount] = useState({username: "", password: ""});
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onSubmit = e => {
        e.preventDefault();
        AuthService.login(account).then(data => {
            console.log(data);
            const { isAuthenticated, account, message} = data;
            if (isAuthenticated) {
                authContext.setAccount(account);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/');
            }
            else {
                setMessage(message);
            }
        })
    };

    const onChange = e => {
        setAccount({...account, [e.target.name] : e.target.value});
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please Log In</h3>
                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text" 
                        name="username"
                        onChange={onChange}
                        className="form-control" 
                        placeholder="Enter Username"
                />
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password"
                        name="password"
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter Password"
                />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            </form>
            { message ? <Message message={message} /> : null}
        </div>
    );
};

export default Login;
