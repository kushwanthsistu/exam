// alert(localStorage.getItem('token')) ;
if(!localStorage.getItem('token'))
location.href='login.html' ;
document.addEventListener("DOMContentLoaded", async () => {
    fetch(`http://localhost:3000/api/user/getExams`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then(res => {
            if(res.status == 500) {
                throw new Error("Internal server Error") ;
            }
            return res.json() ;
        })
        .then(data => {
            if(data.code && data.code == 2001) {
                window.location.href = "login.html";
            }
            displayData(data.data) ;
        })
        .catch(err => {
            // console.log(error) ;
            window.location.href = "ISE.html" ;
            // alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
    })

function displayData(data) {
    console.log(data) ;
    let parent = document.getElementById("examsContainer") ;
    for(let i=0;i<data.length;i++) {
        let element = document.createElement("div") ;
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2" ;
        element.innerHTML = `
            <div class="card">
                    <h1 class="card-title bg-primary text-white rounded">${data[i].title}</h1>
                    <div class="card-body">
                        <p>Duration: ${data[i].timeDuration} </p>

                        <div class="d-flex justify-content-center">
                            <button class="btn btn-info startButtons" id="${data[i]._id}" >Take Test</button>
                        </div>
                    </div>
                </div>
        ` ; 
        parent.appendChild(element) ;
    }
}
document.getElementById("examsContainer").addEventListener("click", (e) => {
    if(e.target.classList.contains("startButtons")) {
        let examId = e.target.id ;
        console.log(examId) ;
        // alert(`http://localhost:3000/api/user/authenticateForTest/${examId}`) ;
        fetch(`http://localhost:3000/api/user/authenticateForTest/${examId}`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then(res => {
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