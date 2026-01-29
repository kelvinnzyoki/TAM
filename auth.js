const API = {
  async request(endpoint, options = {}) {
    const res = await fetch(`https://cctamcc.site${endpoint}`, {
      credentials: "include", // SEND HttpOnly cookies
      headers: { "Content-Type": "application/json" },
      ...options
    });

    if (res.status === 401) {
      await API.refreshToken();
      return API.request(endpoint, options);
    }

    return res.json();
  },

  async refreshToken() {
    await fetch("https://cctamcc.site/auth/refresh", {
      method: "POST",
      credentials: "include"
    });
  },

  async logout() {
    await fetch("https://cctamcc.site/logout", {
      method: "POST",
      credentials: "include"
    });
    location.href = "/index.html";
  }
};    }
  }
};
