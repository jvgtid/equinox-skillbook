export const makeRequest = (endpoint, params, success) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    let url = new URL('http://localhost:5000/' + endpoint);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject();
            }
            return response.json();
        })
        .then(response => {
            if (response.status === 200) {
                return { ...response};
            }
            success(response);

            // Error
            return { ...response};
        });
};
