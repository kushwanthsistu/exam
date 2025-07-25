// syam's update
// added deleteTest api

function displayData(data) {
    draftsContainer = document.getElementById("draftsContainer") ;
    for(let i=0;i<data.length;i++) {
        let element = document.createElement("div") ;
        element.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2" ;
        let sections = "<ul>" ;
        for(let j=0;j<data[i].sections.length;j++) {
            sections += `<li>${data[i].sections[j].subject}</li>` ;
        }
        sections += "</ul>" ;
        console.log(sections) ;
        element.innerHTML = `
            <div class="card">
                <h1 class="card-title bg-secondary text-white rounded">${data[i].title}</h1>
                
                <div class="card-body">
                    <p>Duration: ${data[i].timeDuration} minutes</p>
                    <div>
                        ${sections}
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-info editButton" id=${data[i]._id} data-bs-toggle="modal" data-bs-target="#editTest">Edit Test</button>
                        </div>

                        <div class="col-12 col-md-6 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-danger deleteButton" id=${data[i]._id}>Delete Test</button>
                        </div>

                        <div class="col-12 d-grid mt-2 d-flex justify-content-center">
                            <button type="button" class="btn btn-success">Launch Test</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        ` ;
        draftsContainer.appendChild(element) ;
    }
}

document.getElementById("draftsContainer").addEventListener('click', (e) => {
    if(e.target.classList.contains("editButton")) {
        //window.location.href = `http://localhost:3000/api/admin/editTest/${e.target.id}` ;
        window.open(`http://localhost:3000/api/admin/editTest/${e.target.id}`, '_blank');
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    fetch('http://localhost:3000/api/admin/getDraftTests')
    .then(response => response.json())
    .then(data => {
        console.log(data) ;
        displayData(data.data) ;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}) ;