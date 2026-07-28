/**
 * API Fetch Client Wrapper
 */
const API = {
    async request(endpoint, method = 'GET', data = null) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        };

        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const resData = await response.json();

            if (!response.ok && resData.status !== 'error') {
                throw new Error(resData.message || `HTTP error! Status: ${response.status}`);
            }

            return resData;
        } catch (error) {
            console.error('API Fetch Error:', error);
            return {
                status: 'error',
                message: error.message || 'Gagal terhubung ke server backend'
            };
        }
    },

    get(endpoint) {
        return this.request(endpoint, 'GET');
    },

    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    },

    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    },

    delete(endpoint, data = null) {
        return this.request(endpoint, 'DELETE', data);
    }
};
