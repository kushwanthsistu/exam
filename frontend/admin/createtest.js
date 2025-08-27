import { FRONTEND_URL, BACKEND_URL } from "../config.js";

if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
}

function showLoader(container) {
    container.innerHTML = `
        <div class="text-center my-4" id="loadingMessage">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 fw-semibold text-secondary">Loading...</p>
        </div>
    `;
}

function displayData(data) {
    let draftsContainer = document.getElementById("draftsContainer");
    draftsContainer.innerHTML = ""; // Remove loader

    // If no drafts are available
    if (!data || data.length === 0) {
        draftsContainer.innerHTML = `
            <div class="text-center my-4 text-muted fw-bold">
                No saved drafts
            </div>
        `;
        return;
    }

    for (let i = 0; i < data.length; i++) {
        let element = document.createElement("div");
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";

        // Build sections list
        let sections = "<ul>";
        for (let j = 0; j < data[i].sections.length; j++) {
            sections += `<li>${data[i].sections[j].subject}</li>`;
        }
        sections += "</ul>";

        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-secondary text-white rounded p-2">${data[i].title}</h1>
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration} minutes</p>
                    <div>${sections}</div>
                    <div class="row">
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-info editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Edit Test</button>
                        </div>
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-danger deleteButton" id=${data[i]._id}>Delete Test</button>
                        </div>
                        <div class="col-12 col-md-12 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-primary editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Launch Test</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        draftsContainer.appendChild(element);
    }
}

function deleteTest(id) {
    fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`)
        .then(response => {
            if (response.status !== 200) {
                alert("Internal Server Error!! Try later");
                throw new Error();
            }
            return response.json();
        })
        .then(data => {
            console.log("Deleted the test successfully", data);
            location.reload();
        })
        .catch(() => {
            alert("Failed to delete the test");
        });
}

// Handle edit, delete, and launch buttons using event delegation
document.getElementById("draftsContainer").addEventListener("click", (e) => {
    const target = e.target;

    // Edit or Launch Test
    if (target.classList.contains("editButton")) {
        window.open(`${BACKEND_URL}/api/admin/editTest/${target.id}`, "_blank");
    }

    // Delete Test
    if (target.classList.contains("deleteButton")) {
        const confirmDelete = confirm("Are you sure you want to delete this test?");
        if (confirmDelete) {
            deleteTest(target.id);
        }
    }
});

// Fetch draft tests on page load
document.addEventListener("DOMContentLoaded", async () => {
    const draftsContainer = document.getElementById("draftsContainer");

    // Show loader initially
    showLoader(draftsContainer);

    fetch(`${BACKEND_URL}/api/admin/getDraftTests`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayData(data.data);
        })
        .catch(error => {
            draftsContainer.innerHTML = `
                <div class="text-center my-4 text-danger fw-bold">
                    Internal Server Error. Please refresh the page.
                </div>
            `;
        });
});