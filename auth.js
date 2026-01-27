// --- SESSION GATEKEEPER ---
const SessionManager = {
    checkAuth: function() {
        const user = localStorage.getItem('activeUser');
        if (!user) {
            window.location.href = 'login.html'; // Kick out if not signed in
        }
        return JSON.parse(user);
    },

    saveData: function(key, data) {
        const user = this.checkAuth();
        // Save data unique to this specific user email
        const userKey = `${user.email}_${key}`;
        localStorage.setItem(userKey, JSON.stringify(data));
    },

    getData: function(key) {
        const user = this.checkAuth();
        const userKey = `${user.email}_${key}`;
        const data = localStorage.getItem(userKey);
        return data ? JSON.parse(data) : null;
    }
};