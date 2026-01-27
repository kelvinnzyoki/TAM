// production-core.js
const API_BASE_URL = "https://cctamcc.site"; // Replace with your actual domain

const ProductionAPI = {
    // Get the secure token from session storage (more secure than localStorage for production)
    getToken: () => sessionStorage.getItem('auth_token'),

    // Secure Fetch Wrapper
    request: async (endpoint, options = {}) => {
        const token = ProductionAPI.getToken();
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers }
        });

        if (response.status === 401) {
            // Token expired or invalid
            window.location.href = '/index.html';
            return;
        }

        return response.json();
    }
};
