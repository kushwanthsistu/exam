import { FRONTEND_URL, BACKEND_URL } from "../config.js";

// Check if user is logged in
if (!localStorage.getItem('token')) {
    location.href = 'ISE.html';
}

document.addEventListener("DOMContentLoaded", async () => {
    const parent = document.getElementById("examsContainer");

    // Show loading message
    parent.innerHTML = `
        <div class="text-center my-4" id="loadingMessage">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 fw-semibold">Loading...</p>
        </div>
    `;

    fetch(`${BACKEND_URL}/api/user/getExams`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(res => {
        if (res.status == 500) {
            throw new Error("Internal server Error");
        }
        return res.json();
    })
    .then(data => {
        // If token expired, redirect to login
        if (data.code && data.code == 2001) {
            window.location.href = "login.html";
            return;
        }

        // Remove the loading message
        parent.innerHTML = "";

        // Display exams
        displayData(data.data);
    })
    .catch(err => {
        parent.innerHTML = `
            <div class="text-center my-4 text-danger fw-bold">
                Internal Server Error. Please refresh the page.
            </div>
        `;
    });
});

function displayData(data) {
    let parent = document.getElementById("examsContainer");

    // If there are no tests online
    if (!data || data.length === 0) {
        parent.innerHTML = `
            <div class="text-center my-4 text-muted fw-bold">
                No test online
            </div>
        `;
        return;
    }

    // If there are tests, show them
    for (let i = 0; i < data.length; i++) {
        let element = document.createElement("div");
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";
        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-primary text-white rounded p-2">${data[i].title}</h1>
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration}</p>
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-info startButtons" id="${data[i]._id}">Take Test</button>
                    </div>
                </div>
            </div>
        `;
        parent.appendChild(element);
    }
}

// Handle test start click
document.getElementById("examsContainer").addEventListener("click", (e) => {
    if (e.target.classList.contains("startButtons")) {
        let examId = e.target.id;
        fetch(`${BACKEND_URL}/api/user/authenticateForTest/${examId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (res.status == 500) {
                throw new Error("Internal server Error");
            }
            return res.json();
        })
        .then(data => {
            window.open(`${BACKEND_URL}/api/user/takeTest/${data.data}`, "_blank");
        })
        .catch(err => {
            alert("Internal Server Error, unable to load the details. Try refreshing the page.");
            window.location.href = "ISE.html";
        });
    }
});