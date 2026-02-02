const API = {
  async request(endpoint, options = {}) {
    const url = `https://api.cctamcc.site/${endpoint.replace(/^\//, '')}`;

    try {
      const res = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...options
      });

      if (res.status === 401) {
        const refreshed = await API.refreshToken();
        if (refreshed) {
          return API.request(endpoint, options);
        } else {
          location.href = "/TAM/index.html";
          return;
        }
      }

      return await res.json();
    } catch (err) {
      console.error("Network or API Error:", err);
      throw err;
    }
  },

  async refreshToken() {
    try {
      const res = await fetch("https://cctamcc.site/auth/refresh", {
        method: "POST",
        credentials: "include"
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  // ✅ ADD THIS NEW METHOD
  async checkAuth() {
    try {
      // Make a simple authenticated request to verify the user is logged in
      const response = await fetch("https://cctamcc.site/total-score", {
        credentials: "include"
      });

      // If we get 401, try refreshing the token
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          return null; // Refresh failed, user needs to login
        }
        // Token refreshed successfully, verify again
        const retryResponse = await fetch("https://cctamcc.site/total-score", {
          credentials: "include"
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

  async logout() {
    await fetch("https://cctamcc.site/logout", {
      method: "POST",
      credentials: "include"
    });
    localStorage.clear();
    location.href = "/TAM/index.html";
  }
};


function showToast(message, type = "success", shouldRedirect = true) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.className = `show ${type}`;
    
    setTimeout(() => { 
        toast.className = "";
        if (type === "success" && shouldRedirect) {
            window.location.replace("index2.html"); 
        }
    }, 2500);
}
