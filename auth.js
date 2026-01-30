const API = {
  async request(endpoint, options = {}) {
    // 1. MUST use backticks (`) for template literals
    // 2. Ensure a / exists between the site and the endpoint
    const url = `https://cctamcc.site/${endpoint.replace(/^\//, '')}`;

    try {
      const res = await fetch(url, {
        credentials: "include", // Required for HttpOnly cookies
        headers: { "Content-Type": "application/json" },
        ...options
      });

      // Handle 401 Unauthorized (Token Expired)
      if (res.status === 401) {
        const refreshed = await API.refreshToken();
        if (refreshed) {
          return API.request(endpoint, options); // Retry original request
        } else {
          location.href = "/TAM/index.html"; // Refresh failed, go to login
          return;
        }
      }

      return await res.json();
    } catch (err) {
      console.error("Network or API Error:", err);
      throw err; // This triggers the 'catch' in your score pages
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
