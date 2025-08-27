import { FRONTEND_URL, BACKEND_URL } from "../config.js";

const form = document.querySelector("form");
const loader = document.getElementById("loader");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const userEmail = document.getElementById("userEmail").value.trim();
    const userPassword = document.getElementById("userPassword").value.trim();

    // Simple validation
    if (userEmail.length === 0) {
        alert("Email ID should not be empty");
        return;
    }
    if (userPassword.length === 0) {
        alert("Password should not be empty");
        return;
    }

    // Show loader
    loader.classList.remove("d-none");

    fetch(`${BACKEND_URL}/api/authenticate/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailId: userEmail,
            password: userPassword,
        }),
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((errData) => {
                throw new Error(errData.message || "Login failed");
            });
        }
        return response.json();
    })
    .then((data) => {
        if (data.status) {
            // Success message
            alert(data.message);

            // Save token
            localStorage.setItem("token", data.token);

            // Hide loader before redirecting
            loader.classList.add("d-none");

            // Redirect to home page
            window.location.href = "home.html";
        } else {
            alert(data.message || "Login failed");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
    })
    .finally(() => {
        // Hide loader when request is done (success or error)
        loader.classList.add("d-none");
    });
});