// production-core.js
const API_BASE_URL = "https://cctamcc.site";

const ProductionAPI = {
  getToken: () => sessionStorage.getItem('auth_token'),

  request: async (endpoint, options = {}) => {
    const token = ProductionAPI.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
      });

      if (response.status === 401) {
        sessionStorage.removeItem("auth_token");
        window.location.replace('/index.html');
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return null;

    } catch (err) {
      console.error("API request failed:", err);
      throw new Error("Network error");
    }
  }
};
