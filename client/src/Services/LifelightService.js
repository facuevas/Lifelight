export default {
    getLifelights: () => {
        return fetch('/v1/lifelights')
            .then(res => {
                if (res.status !== 401) {
                    return res.json().then(data => data);
                }
                else {
                    return { message: {msgBody: "Unauthorized", msgError: true}};
                }
            });
    },
    createLifelight: lifelight => {
        return fetch('/v1/create_lifelight', {
            method: "post",
            body: JSON.stringify(lifelight),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 401) {
                return res.json().then(data => data);
            }
            else {
                return { message: {msgBody: "Unauthorized", msgError: true}};
            }
        })
    },
    getUsername: user_id => {
        return fetch('/v1/find/'+user_id)
            .then(res => {
                if (res.status !== 401) {
                    return res.json().then(data => data);
                }
                else {
                    return { message: {msgBody: "Error retrieving username from client-side", msgError: true}};
                }
            });
    }
}