import { FRONTEND_URL, BACKEND_URL } from "../config.js";

if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
}

function showLoader(container) {
    container.innerHTML = `
        <div class="text-center my-4" id="loadingMessage">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 fw-semibold">Loading...</p>
        </div>
    `;
}

function createStructure(data, container, status) {
    container.innerHTML = ""; // Remove loader

    // If no data found, show appropriate message
    if (!data || !data.data || data.data.length === 0) {
        container.innerHTML = `
            <div class="text-center my-4 text-muted fw-bold">
                ${status ? "No ongoing tests" : "No disabled tests"}
            </div>
        `;
        return;
    }

    data = data.data;

    for (let i = 0; i < data.length; i++) {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";

        colDiv.innerHTML = `
            <div class="card">
                <h1 class="card-title ${status ? 'bg-primary' : 'bg-secondary'} text-white rounded p-2">${data[i].title}</h1>
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration} </p>

                    <div class="row justify-content-center">
                        <div class="d-flex justify-content-center col-12 col-lg-6 mt-3">
                            <button class="btn btn-warning statusButtons statisticsButton" onclick="openStatisticsModal('${data[i]._id}')" id=${data[i]._id}>View Statistics</button>    
                        </div>

                        <div class="d-flex justify-content-center col-12 col-lg-6 mt-3">
                            <button class="btn ${status ? 'btn-secondary' : 'btn-primary'} statusChangingButton" id=${data[i]._id}>${status ? 'Disable' : 'Enable'} Test</button>    
                        </div>

                        <div class="d-flex justify-content-center col-12 col-lg-12 mt-3">
                            <button class="btn btn-danger statusButtons deleteButton" id=${data[i]._id}>Delete Test</button>
                        </div>

                        <div class="modal fade" id="statisticsModal" tabindex="-1" aria-labelledby="statisticsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-xl">
                                <div class="modal-content" style="height: 90vh;">
                                    <div class="modal-header bg-warning">
                                        <h5 class="modal-title fw-bold" id="statisticsModalLabel">Test Statistics</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body p-0" style="height: calc(100% - 56px);">
                                        <iframe id="statisticsIframe" style="width:100%; height:100%; border:0;"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(colDiv);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const ongoingContainer = document.getElementById("ongoingExamContainer");
    const expiredContainer = document.getElementById("expiredExamContainer");

    // Show individual loaders
    showLoader(ongoingContainer);
    showLoader(expiredContainer);

    // Fetch Ongoing Tests
    fetch(`${BACKEND_URL}/api/admin/getOngoingTests`)
        .then(response => response.json())
        .then(data => {
            createStructure(data, ongoingContainer, true);
        })
        .catch(error => {
            ongoingContainer.innerHTML = `
                <div class="text-center my-4 text-danger fw-bold">
                    Internal Server Error. Please refresh the page.
                </div>
            `;
        });

    // Fetch Disabled Tests
    fetch(`${BACKEND_URL}/api/admin/getDisabledTests`)
        .then(response => response.json())
        .then(data => {
            createStructure(data, expiredContainer, false);
        })
        .catch(error => {
            expiredContainer.innerHTML = `
                <div class="text-center my-4 text-danger fw-bold">
                    Internal Server Error. Please refresh the page.
                </div>
            `;
        });

    function getStatus(id) {
        const iframe = document.getElementById("statisticsIframe");
        iframe.src = `testStatistics.html?testId=${id}`;
        const statisticsModal = new bootstrap.Modal(document.getElementById("statisticsModal"));
        statisticsModal.show();
    }

    function deleteTest(id) {
        fetch(`${BACKEND_URL}/api/admin/deleteTest/${id}`)
            .then(response => {
                if (response.status != 200) {
                    alert("Internal Server Error!! try later");
                    throw new Error();
                }
                return response.json();
            })
            .then(() => {
                location.reload();
            })
            .catch(() => {
                alert("Failed to delete the test");
            });
    }

    // Ongoing tests buttons
    ongoingContainer.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("statusChangingButton")) {
            fetch(`${BACKEND_URL}/api/admin/disableTest/${e.target.id}`)
                .then(response => {
                    if (response.status != 200) {
                        alert("Internal Server Error!! try later");
                        throw new Error();
                    }
                    return response.json();
                })
                .then(() => location.reload())
                .catch(() => alert("Failed to disable the test"));
        }
        if (e.target && e.target.classList.contains("statisticsButton")) {
            getStatus(e.target.id);
        }
        if (e.target && e.target.classList.contains("deleteButton")) {
            const confirmDelete = confirm("Are you sure you want to delete this test?");
            if (confirmDelete) {
                deleteTest(e.target.id);
            }
        }
    });

    // Disabled tests buttons
    expiredContainer.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("statusChangingButton")) {
            fetch(`${BACKEND_URL}/api/admin/enableTest/${e.target.id}`)
                .then(response => {
                    if (response.status != 200) {
                        alert("Internal Server Error!! try later");
                        throw new Error();
                    }
                    return response.json();
                })
                .then(() => location.reload())
                .catch(() => alert("Failed to enable the test"));
        }
        if (e.target && e.target.classList.contains("statisticsButton")) {
            getStatus(e.target.id);
        }
        if (e.target && e.target.classList.contains("deleteButton")) {
            const confirmDelete = confirm("Are you sure you want to delete this test?");
            if (confirmDelete) {
                deleteTest(e.target.id);
            }
        }
    });
});