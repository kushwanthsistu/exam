document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent form's default behavior

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

/*     new Promise((resolve) => {
        // Simulate a successful login response
        resolve({
            ok: true,
            json: () => Promise.resolve({
                "code": 200,
                "status": true,
                "message": "Login successfully"
            })
        });
    }) */

    fetch('http://localhost:3000/api/authenticate/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emailId: userEmail,
            password: userPassword
        })
    })
    .then(response => {
        if (!response.ok) { // ok:false;
            return response.json().then(errData => {
                throw new Error(errData.message || "Login failed");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status) { // status: true
            // success message
            alert(data.message);

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            //alert(data.token) ;

            // Go to student home page
            window.location.href = "home.html";
        } else {
            // This block may not be needed, as we throw error above on non-ok responses
            alert(data.message || "Login failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message);
    });
});