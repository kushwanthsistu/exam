if(!localStorage.getItem('token'))
location.href='login.html' ;
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
                            <button class="btn btn-warning statusButtons" id="${data[i].examId}">View Statistics</button>    
                        </div>
                    </div>
                </div>
            </div>
        ` ; 
        parent.appendChild(element) ;
    }
}

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
                            <button class="btn btn-primary startButtons" id="${data[i].examId}">Take Test</button>
                        </div>
                    </div>
                </div>
            </div>
        ` ; 
        parent.appendChild(element) ;
    }
}

document.getElementById("completedBlock").addEventListener("click", (e) => {
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
            window.location.href = `http://localhost:3000/api/user/analysis/${data.data}` ;
        })
        .catch(err => {
            // console.log(error) ;
            alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
    }
})    
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
            window.location.href = `http://localhost:3000/api/user/takeTest/${data.data}` ;
        })
        .catch(err => {
            // console.log(error) ;
            alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
    }
})