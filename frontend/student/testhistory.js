if(!localStorage.getItem('token')){
    location.href='ISE.html';
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/api/user/getPendingExams`, {
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
        if(res.status != 200) {
            throw new Error("Internal server Error") ;
        }
        return res.json() ;
    })
    .then(data => {
        data = data.data ;
        displayPendingData(data) ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });

    fetch(`http://localhost:3000/api/user/getCompletedExams`, {
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
        if(res.status != 200) {
            throw new Error("Internal server Error") ;
        }
        return res.json() ;
    })
    .then(data => {
        data = data.data ;
        // console.log(data) ;
        displayCompletedData(data) ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
})

function displayCompletedData(data) {
    console.log(data) ;
    let parent = document.getElementById("completedBlock") ;
    for(let i=0;i<data.length;i++) {
        let element = document.createElement("div") ;
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2" ;
        element.innerHTML = `
        <div class="card">
            <h1 class="card-title bg-secondary text-white rounded">${data[i].examTitle}</h1>
            <div class="card-body">

                <div class="row">
                    <div class="d-flex justify-content-center col-12 mt-3">
                        <button 
                            class="btn btn-warning view-analysis-btn startButtons" 
                            data-exam-id="${data[i].examId}" 
                            data-bs-toggle="modal" 
                            data-bs-target="#analysisModal-${data[i].examId}">
                            View Statistics
                        </button>
                    </div>

                    <!-- Modal with dynamic ID -->
                    <div class="modal fade" id="analysisModal-${data[i].examId}" tabindex="-1" aria-labelledby="analysisModalLabel-${data[i].examId}" aria-hidden="true">
                        <div class="modal-dialog modal-xl" style="max-width: 90%;">
                            <div class="modal-content" style="height: 90vh;">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="analysisModalLabel-${data[i].examId}">Analysis Report</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body p-0" style="height: calc(100% - 112px);"> <!-- reduce height for footer -->
                                    <iframe id="analysisIframe-${data[i].examId}" src="" style="width:100%; height:100%; border:0;"></iframe>
                                </div>

                                <div class="modal-footer d-flex justify-content-center align-items-center">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` ; 
        parent.appendChild(element) ;
    }
}

// View Statistics button
document.getElementById("completedBlock").addEventListener("click", (e) => {
    if (e.target.classList.contains("startButtons")) {
        let examId = e.target.getAttribute("data-exam-id");

        fetch(`http://localhost:3000/api/user/authenticateForTest/${examId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (res.status === 500) {
                throw new Error("Internal server error");
            }
            return res.json();
        })
        .then(data => {
            const iframe = document.getElementById(`analysisIframe-${examId}`);
            if (iframe) {
                iframe.src = `http://localhost:3000/api/user/analysis/${data.data}`;
            }

            const modalElement = document.getElementById(`analysisModal-${examId}`);
            if (modalElement) {
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();

                // Reload page on modal close
                modalElement.addEventListener('hidden.bs.modal', () => {
                    location.reload();  // Reload parent page after modal is dismissed
                }, { once: true }); // Only run once
            } else {
                alert("Modal not found for this exam.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Internal Server Error, unable to load the details. Try refreshing the page.");
        });
    }
});

function displayPendingData(data) {
    console.log(data) ;
    let parent = document.getElementById("pendingBlock") ;
    for(let i=0;i<data.length;i++) {
        let element = document.createElement("div") ;
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2" ;
        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-primary text-white rounded">${data[i].examTitle}</h1>
                <div class="card-body">
                    <p>Time left : ${data[i].timeRemaining} </p>

                    <div class="row">
                        <div class="d-flex justify-content-center col-12 mt-3">
                            <button class="btn btn-primary startButtons" id="${data[i].examId}">Resume Test</button>
                        </div>
                    </div>
                </div>
            </div>
        ` ; 
        parent.appendChild(element) ;
    }
}

document.getElementById("pendingBlock").addEventListener("click", (e) => {
    if(e.target.classList.contains("startButtons")) {
        let examId = e.target.id ;
        // console.log(examId) ;
        // alert(`http://localhost:3000/api/user/authenticateForTest/${examId}`) ;
        fetch(`http://localhost:3000/api/user/authenticateForTest/${examId}`, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            // console.log("working till here") ;
            if(res.status == 500) {
                throw new Error("Internal server Error") ;
            }
            return res.json() ;
        })
        .then(data => {
            // alert(data.data) ;
            window.open(`http://localhost:3000/api/user/takeTest/${data.data}`, '_blank');
            //window.location.href = `http://localhost:3000/api/user/takeTest/${data.data}` ;
        })
        .catch(err => {
            // console.log(error) ;
            alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
    }
})