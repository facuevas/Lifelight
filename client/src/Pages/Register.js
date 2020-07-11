import React, { useState, useRef, useEffect } from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';

const Register = props => {
    const [account, setAccount] = useState({username: "", password: "", email: ""});
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
          clearTimeout(timerID);  
        };
    }, []);

    const resetForm = () => {
        setAccount({username: "", password: "", email: ""});
    };

    const onSubmit = event => {
        event.preventDefault();
        AuthService.register(account).then(data => {
            const { message } = data;
            console.log(message);
            setMessage(message);
            resetForm();
            if (!message.msgError) {
                timerID = setTimeout(() => {
                    props.history.push('/login');
                }, 1000);
            }
        });
    };

    const onChange = event => {
        setAccount({...account, [event.target.name] : event.target.value});
        console.log(account);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Register for a Lifelight account today!</h3>
                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text"
                        name="username"
                        value={account.username}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter a username"
                 />
                 <label htmlFor="password" className="sr-only">Password</label>
                <input type="password"
                        name="password"
                        value={account.password}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter a password"
                 />
                 <label htmlFor="email" className="sr-only">Email</label>
                <input type="text"
                        name="email"
                        value={account.email}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter your email address"
                 />
                 <button type="submit" className="btn btn-lg btn-primary btn-block">Register</button>
            </form>
            {message ? <Message message={message} /> : null}
        </div>
    )
}

export default Register;