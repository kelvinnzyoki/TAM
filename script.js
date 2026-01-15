document.addEventListener("DOMContentLoaded", () => {
    const supabaseUrl = "https://gzzonrfqbkrbssarrjch.supabase.co";
    const supabaseKey = "sb_secret_4YVRD6MYkCV18Sf4FWeEtg_yG7JGZzm";
    const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);
    const SERVER_URL = "https://mybackend-production-b618.up.railway.app";
    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");

    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => loginModal.style.display = "none";
    
    window.onclick = (e) => { 
        if(e.target == loginModal) loginModal.style.display = "none"; 
    };

   if (!loginForm) {
    console.error("Login form not found!");
    return;
   } 
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const submitBtn = document.getElementById("submitLogin");

        submitBtn.innerText = "AUTHORIZING...";
        submitBtn.disabled = true;
        const { data, error } = await supabase
  .from("users")
  .select("*");
        const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@email.com",
  password: "password123"
});
        const { data: { user } } = await supabase.auth.getUser();
        

if (error) {
  console.error(error);
} else {
  console.log(data);
}

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.username);
                window.location.href = "index2.html"; 
            } else {
                alert(data.message || "Login Failed");
                submitBtn.innerText = "AUTHORIZE";
                submitBtn.disabled = false;
            }
        } catch (err) {
            alert("Server Offline. Please try later.");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
        }
    });
});
