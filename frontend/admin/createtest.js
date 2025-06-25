// document.addEventListener('DOMContentLoaded', function () {
//     var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//         return new bootstrap.Tooltip(tooltipTriggerEl);
//     });
// });


// let sectionCount = 0;


// function addSectionTab() {
//     sectionCount++;
//     const tabId = `section-${sectionCount}`;
//     const navTabs = document.getElementById("sectionTabs");
//     const tabContent = document.getElementById("sectionTabsContent");

//     // Create tab button
//     const newTab = document.createElement("li");
//     newTab.className = "nav-item";
//     newTab.role = "presentation";
//     newTab.innerHTML = `
//         <button class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button" role="tab">
//             Section ${sectionCount}
//         </button>`;
//     navTabs.appendChild(newTab);

//     // Create tab content
//     const newContent = document.createElement("div");
//     newContent.className = "tab-pane fade";
//     newContent.id = tabId;
//     newContent.role = "tabpanel";
//     newContent.innerHTML = getSectionHtml(tabId);
//     tabContent.appendChild(newContent);

//     // Activate the new tab
//     new bootstrap.Tab(document.getElementById(`${tabId}-tab`)).show();
// }

// function getSectionHtml(sectionId) {
//     return `
//         <div class="p-2 border rounded">
//             <div class="mb-2">
//                 <label class="form-label">Section Name:</label>
//                 <input type="text" class="form-control" name="sectionName">
//             </div>
//             <div class="mb-2">
//                 <label class="form-label">Positive Marking:</label>
//                 <input type="number" class="form-control" name="positiveMarking">
//             </div>
//             <div class="mb-2">
//                 <label class="form-label">Negative Marking:</label>
//                 <input type="number" class="form-control" name="negativeMarking">
//             </div>
//             <div class="mb-2">
//                 <button type="button" class="btn btn-success" onclick="addQuestion(this)">Add Question</button>
//             </div>
//             <div class="question-container"></div>
//             <div class="text-end mt-2">
//                 <button type="button" class="btn btn-danger" onclick="removeSection('${sectionId}')">Delete Section</button>
//             </div>
//         </div>`;
// }

// function addQuestion(btn) {
//     const qContainer = btn.closest('.p-2').querySelector('.question-container');
//     const qIndex = qContainer.children.length + 1;



// function addSectionTab() {
//     sectionCount++;
//     const tabId = `section-${sectionCount}`;
//     const navTabs = document.getElementById("sectionTabs");
//     const tabContent = document.getElementById("sectionTabsContent");

//     // Create tab button
//     const newTab = document.createElement("li");
//     newTab.className = "nav-item";
//     newTab.role = "presentation";
//     newTab.innerHTML = `
//         <button class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button" role="tab">
//             Section ${sectionCount}
//         </button>`;
//     navTabs.appendChild(newTab);

//     // Create tab content
//     const newContent = document.createElement("div");
//     newContent.className = "tab-pane fade";
//     newContent.id = tabId;
//     newContent.role = "tabpanel";
//     newContent.innerHTML = getSectionHtml(tabId);
//     tabContent.appendChild(newContent);

//     // Activate the new tab
//     new bootstrap.Tab(document.getElementById(`${tabId}-tab`)).show();
// }

// function getSectionHtml(sectionId) {
//     return `
//         <div class="p-2 border rounded">
//             <div class="mb-2">
//                 <label class="form-label">Section Name:</label>
//                 <input type="text" class="form-control" name="sectionName">
//             </div>
//             <div class="mb-2">
//                 <label class="form-label">Positive Marking:</label>
//                 <input type="number" class="form-control" name="positiveMarking">
//             </div>
//             <div class="mb-2">
//                 <label class="form-label">Negative Marking:</label>
//                 <input type="number" class="form-control" name="negativeMarking">
//             </div>
//             <div class="mb-2">
//                 <button type="button" class="btn btn-success" onclick="addQuestion(this)">Add Question</button>
//             </div>
//             <div class="question-container"></div>
//             <div class="text-end mt-2">
//                 <button type="button" class="btn btn-danger" onclick="removeSection('${sectionId}')">Delete Section</button>
//             </div>
//         </div>`;
// }

// function addQuestion(btn) {
//     const qContainer = btn.closest('.p-2').querySelector('.question-container');
//     const qIndex = qContainer.children.length + 1;


//     const qDiv = document.createElement("div");
//     qDiv.className = "border p-2 mb-2";
//     qDiv.innerHTML = `
//         <div class="mb-1">
//             <label>Question ${qIndex}:</label>
//             <input type="text" class="form-control mb-1" name="questionText">
//         </div>
//         <div class="option-list"></div>
//         <button type="button" class="btn btn-sm btn-outline-primary" onclick="addOption(this)">
//             <i class="bi bi-plus"></i> Add Option
//         </button>
//     `;
//     qContainer.appendChild(qDiv);

//     addOption(qDiv.querySelector(".btn"));
// }

// function addOption(btn) {
//     const optionList = btn.closest('.border').querySelector('.option-list');
//     const oIndex = optionList.children.length + 1;

//     const optDiv = document.createElement("div");
//     optDiv.className = "input-group mb-1";
//     optDiv.innerHTML = `
//         <div class="input-group-text">
//             <input type="checkbox" aria-label="Correct Option">
//         </div>
//         <input type="text" class="form-control" placeholder="Option ${oIndex}">
//         <button type="button" class="btn btn-outline-danger" onclick="removeOption(this)">
//             <i class="bi bi-x"></i>
//         </button>
//     `;
//     optionList.appendChild(optDiv);
// }


// function removeOption(btn) {
//     btn.closest('.input-group').remove();
// }

// function removeSection(sectionId) {
//     document.getElementById(`${sectionId}-tab`).parentElement.remove();
//     document.getElementById(sectionId).remove();

//     // Activate first tab if exists
//     const firstTab = document.querySelector("#sectionTabs button.nav-link");
//     if (firstTab) {
//         new bootstrap.Tab(firstTab).show();
//     }
// }

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

// Delegate click events
document.getElementById("draftsContainer").addEventListener('click', async (e) => {
    if (e.target.classList.contains("editButton")) {
        window.location.href = `http://localhost:3000/api/admin/editTest/${e.target.id}`;
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


// function removeOption(btn) {
//     btn.closest('.input-group').remove();
// }

// function removeSection(sectionId) {
//     document.getElementById(`${sectionId}-tab`).parentElement.remove();
//     document.getElementById(sectionId).remove();

//     // Activate first tab if exists
//     const firstTab = document.querySelector("#sectionTabs button.nav-link");
//     if (firstTab) {
//         new bootstrap.Tab(firstTab).show();
//     }
// }

