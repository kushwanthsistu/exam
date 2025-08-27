import { FRONTEND_URL, BACKEND_URL } from "../config.js";

let token = localStorage.getItem("token");

if (!token) {
    location.href = 'ISE.html';
}

document.addEventListener("DOMContentLoaded", () => {
    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");

    // Show loading text initially
    nameEl.innerHTML = `<span class="text-secondary">Loading...</span>`;
    emailEl.innerHTML = `<span class="text-secondary">Loading...</span>`;

    fetch(`${BACKEND_URL}/api/user/getProfile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 500) {
            throw new Error("Internal server error");
        }
        return res.json();
    })
    .then(data => {
        data = data.data;

        // Set user details
        nameEl.textContent = data.name || "Not available";
        emailEl.textContent = data.emailId || "Not available";
    })
    .catch(err => {
        console.error(err);
        nameEl.innerHTML = `<span class="text-danger">Failed to load</span>`;
        emailEl.innerHTML = `<span class="text-danger">Failed to load</span>`;
    });
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('token');
    location.href = 'login.html';
});