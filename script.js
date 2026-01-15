document.addEventListener("DOMContentLoaded", () => {

  // ✅ SAFE Supabase credentials
  const supabaseUrl = "https://gzzonrfqbkrbssarrjch.supabase.co";
  const supabaseKey = "YOUR_ANON_PUBLIC_KEY_HERE";

  const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const closeBtn = document.getElementById("closeBtn");
  const loginForm = document.getElementById("loginForm");

  loginBtn.onclick = () => loginModal.style.display = "block";
  closeBtn.onclick = () => loginModal.style.display = "none";

  window.onclick = (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const submitBtn = document.getElementById("submitLogin");

    submitBtn.innerText = "AUTHORIZING...";
    submitBtn.disabled = true;

    // ✅ Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      submitBtn.innerText = "ENTER SYSTEM";
      submitBtn.disabled = false;
      return;
    }

    // ✅ Login success
    const user = data.user;

    localStorage.setItem("userId", user.id);
    localStorage.setItem("userEmail", user.email);

    window.location.href = "index2.html";
      const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  window.location.href = "index.html";
}
  });

});
