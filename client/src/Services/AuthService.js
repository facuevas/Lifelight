export default {
    login: account => {
        return fetch('/v1/login', {
            method: "post",
            body: JSON.stringify(account),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 401) {
                    return res.json().then(data => data);
                }
                else {
                    return { isAuthenticated: false, account: { username: ""}, message: {msgBody: "Invalid username or password", msgError: true}};
                }
            });
    },
    register: account => {
        return fetch('/v1/register', {
            method: "post",
            body: JSON.stringify(account),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json)
            .then(data => data);
    },
    logout: () => {
        return fetch('/v1/logout')
            .then(res => res.json())
            .then(data => data);
    },
    isAuthenticated: () => {
        return fetch('/')
    }
}