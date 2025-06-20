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