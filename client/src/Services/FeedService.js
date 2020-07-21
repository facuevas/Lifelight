export default {
    displayFeed: () => {
        return fetch('/v1/feed')
            .then(res => {
                if (res.status !== 401) {
                    return res.json().then(data => data);
                }
                else {
                    return { mesasge: {msgBody: "Unauthorized", msgError: true}};
                }
            })
    }
}