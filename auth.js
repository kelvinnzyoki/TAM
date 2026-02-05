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
            // Try to fetch user data - if successful, user is authenticated
            const response = await fetch(`${API_BASE_URL}/total-score`, {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            // If we get 401, try refreshing the token
            if (response.status === 401) {
                console.log("Access token expired, trying refresh...");
                const refreshed = await this.refreshToken();
                
                if (!refreshed) {
                    console.log("Refresh failed - user needs to login");
                    return null;
                }
                
                // Token refreshed successfully, verify again
                const retryResponse = await fetch(`${API_BASE_URL}/total-score`, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                
                if (retryResponse.ok) {
                    console.log("✅ User authenticated after refresh");
                    return { authenticated: true };
                } else {
                    return null;
                }
            }

            // If response is OK, user is authenticated
            if (response.ok) {
                console.log("✅ User authenticated");
                return { authenticated: true };
            }

            console.log("User not authenticated");
            return null;

        } catch (error) {
            console.error("Auth check failed:", error);
            return null;
        }
    },

    /**
     * Check session and get user info
     * @returns {Object|null} - User data or null
     */
    async checkSession() {
        try {
            // First verify authentication
            const authStatus = await this.checkAuth();
            
            if (!authStatus || !authStatus.authenticated) {
                return null;
            }

            // Get username from localStorage (set during login)
            const username = localStorage.getItem("username");
            
            if (username) {
                return { username, authenticated: true };
            }

            // If no username in localStorage but authenticated, return basic info
            return { authenticated: true };
            
        } catch (err) {
            console.log("No active session:", err);
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
            
            console.log("✅ Logout successful");
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

            console.log("✅ Login successful");
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

            console.log("✅ Signup successful");
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

            console.log("✅ Verification code sent");
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

// ============= AUTO SESSION CHECK ON PAGE LOAD =============
// This runs on every page to check if user is logged in
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔍 Checking session...");
    
    const user = await API.checkSession();
    
    if (user && user.authenticated) {
        console.log("✅ Active session found:", user.username || "User");
        
        // Update login button to show dashboard link
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerText = "DASHBOARD";
            loginBtn.onclick = (e) => {
                e.preventDefault();
                window.location.replace("index2.html");
            };
        }
        
        // If on login page (index0.html), redirect to dashboard
        if (window.location.pathname.includes('index0.html')) {
            console.log("Already logged in, redirecting to dashboard...");
            setTimeout(() => {
                window.location.replace("index2.html");
            }, 500);
        }
    } else {
        console.log("No active session");
        
        // If on protected page (index2.html) and not logged in, redirect to login
        if (window.location.pathname.includes('index2.html')) {
            console.log("Not authenticated, redirecting to login...");
            setTimeout(() => {
                window.location.replace("index0.html");
            }, 500);
        }
    }
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.API = API;
    window.showToast = showToast;
}
