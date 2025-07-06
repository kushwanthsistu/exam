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

/* document.getElementById("draftsContainer").addEventListener('click', (e) => {
    if(e.target.classList.contains("editButton")) {
        window.location.href = `http://localhost:3000/api/admin/editTest/${e.target.id}` ;
    }
}) */

// Delegate click events - Edit button and Delete button
document.getElementById("draftsContainer").addEventListener('click', async (e) => {
    if (e.target.classList.contains("editButton")) {
        //window.location.href = `http://localhost:3000/api/admin/editTest/${e.target.id}`;
        // To open in different tab instead of same tab
        window.open(`http://localhost:3000/api/admin/editTest/${e.target.id}`, '_blank');
    } else if (e.target.classList.contains("deleteButton")) {
        const testId = e.target.id;
        if (confirm("Are you sure you want to delete this test?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/deleteTest/${testId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    //alert("Test deleted successfully.");
                    // Reload the page so that deleted one disappears
                    window.location.reload();
                }
                else {
                    const errorData = await response.json();
                    alert(`Error deleting test: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error("Error deleting test:", error);
                alert("Error deleting test.");
            }
        }
    }
});

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