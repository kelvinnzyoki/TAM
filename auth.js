/* ============================================================================
   TAM AUTHENTICATION MODULE - FIXED FOR CUSTOM DOMAIN
   Server: https://api.cctamcc.site
   Frontend: https://cctamcc.site
   ============================================================================ */

const API_BASE_URL = "https://api.cctamcc.site";

const API = {
    /**
     * Main request handler with auto-retry on 401
     * @param {String} endpoint - API endpoint (with or without leading slash)
     * @param {Object} options - Fetch options
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;

        try {
            const res = await fetch(url, {
                credentials: "include", // Critical: sends cookies cross-origin
                headers: { "Content-Type": "application/json" },
                ...options
            });

            // Handle 401 - try to refresh token
            if (res.status === 401) {
                console.log("401 detected, attempting token refresh...");
                const refreshed = await API.refreshToken();
                
                if (refreshed) {
                    console.log("Token refreshed, retrying request...");
                    // Retry the original request
                    return API.request(endpoint, options);
                } else {
                    console.log("Refresh failed, redirecting to login...");
                    location.href = "index0.html";
                    return null;
                }
            }

            // Handle other error status codes
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
                throw new Error(errorData.message || `HTTP ${res.status}`);
            }

            return await res.json();
        } catch (err) {
            console.error("API Request Error:", err);
            throw err;
        }
    },

    /**
     * Refresh access token using refresh token
     * @returns {Boolean} - Success status
     */
    async refreshToken() {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include", // Send cookies
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                console.log("✅ Token refresh successful");
                return true;
            } else {
                console.log("❌ Token refresh failed:", res.status);
                return false;
            }
        } catch (err) {
            console.error("Refresh token error:", err);
            return false;
        }
    },

    /**
     * Check if user is authenticated
     * @returns {Object|null} - Auth status or null
     */
    async checkAuth() {
        try {
            const response = await fetch(`${API_BASE_URL}/total-score`, {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            // If we get 401, try refreshing the token
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                
                if (!refreshed) {
                    return null; // Refresh failed, user needs to login
                }
                
                // Token refreshed successfully, verify again
                const retryResponse = await fetch(`${API_BASE_URL}/total-score`, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                
                return retryResponse.ok ? { authenticated: true } : null;
            }

            // If response is OK, user is authenticated
            if (response.ok) {
                return { authenticated: true };
            }

            return null;

        } catch (error) {
            console.error("Auth check failed:", error);
            return null;
        }
    },

    /**
     * Logout user and clear session
     */
    async logout() {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            // Clear local storage regardless of API response
            localStorage.clear();
            location.href = "index0.html";
        }
    },

    /**
     * Login user
     * @param {String} email 
     * @param {String} password 
     */
    async login(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            return data;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    },

    /**
     * Signup new user
     * @param {Object} userData - User registration data
     */
    async signup(userData) {
        try {
            const res = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            return data;
        } catch (err) {
            console.error("Signup error:", err);
            throw err;
        }
    },

    /**
     * Send verification code
     * @param {String} email 
     */
    async sendCode(email) {
        try {
            const res = await fetch(`${API_BASE_URL}/send-code`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send code");
            }

            return data;
        } catch (err) {
            console.error("Send code error:", err);
            throw err;
        }
    }
};

/**
 * Toast notification helper
 * @param {String} message 
 * @param {String} type - success, error, info
 * @param {Boolean} shouldRedirect 
 */
function showToast(message, type = "success", shouldRedirect = false) {
    const toast = document.getElementById("toast");
    if (!toast) {
        console.warn("Toast element not found");
        return;
    }

    toast.innerText = message;
    toast.className = `show ${type}`;
    
    setTimeout(() => { 
        toast.className = "";
        if (type === "success" && shouldRedirect) {
            window.location.replace("index2.html"); 
        }
    }, 2500);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.API = API;
    window.showToast = showToast;
  }
