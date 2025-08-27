import { FRONTEND_URL, BACKEND_URL } from "../config.js";

let sectionCount = 1 ;
window.deleteButtonFunction = function(sectionNumber) {
    if(sectionCount === 1) {
        alert("sections count cannot be zero"); 
        return;
    }
    document.getElementById(`section${sectionNumber}`).remove();
    sectionCount--;
};

let addSectionsButton = document.getElementById("addSections").addEventListener('click', () => {
    sectionCount = sectionCount+1 ;
    const content = document.createElement("div");
    content.id = `section${sectionCount}`;
    content.className = "card p-3 mt-2"
    content.innerHTML = `
        <div class="row mb-3">
            <label for="section${sectionCount}Title" class="col-form-label col-12 col-sm-4 d-flex justify-content-md-end mt-3 mt-sm-0">Section name</label>
            <div class="col-12 col-sm-8">
                <input type="text" id="section${sectionCount}Title" class="form-control" placeholder="Section name" required>
            </div>
        </div>

        <div class="row mb-3">
            <label for="section${sectionCount}Questions" class="col-form-label col-12 col-sm-4 d-flex justify-content-md-end mt-3 mt-sm-0">No. of questions</label>
            <div class="col-12 col-sm-8">
                <input type="text" min="1" id="section${sectionCount}Questions" class="form-control" placeholder="No. of questions" required>
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <button onclick=deleteButtonFunction(${sectionCount}) class="btn btn-danger">delete</button>
        </div>
    ` ;
    document.getElementById('sections').appendChild(content) ;
})


// document.getElementById('createTestButton').addEventListener('click', () => {
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    const details = {};

    // Get title
    const title = document.getElementById("title").value.trim();
    if (!title) {
        return alert("Title can't be empty");
    }
    details.title = title;

    // Get total questions
    const totalQuestions = Number(document.getElementById("questions").value);
    if (!totalQuestions || totalQuestions <= 0) {
        return alert("Total questions can't be empty or zero");
    }
    details.totalQuestions = totalQuestions;

    // Get time duration (HH:MM format)
    const timeStr = document.getElementById("timeDuration").value; // e.g. "01:30"
    if (!timeStr) {
        return alert("Time duration is required");
    }

    // Parse into hours and minutes
    const [hours, minutes] = timeStr.split(":").map(Number); // e.g. [1, 30]

    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes <= 0) {
        return alert("Time duration must be a positive number");
    }
    details.timeDuration = totalMinutes; // Store as total minutes


    // Get marks
    const positiveMarks = Number(document.getElementById("positiveMarks").value);
    const negativeMarks = Number(document.getElementById("negativeMarks").value);
    // negativeMarks can be 0
    if (!positiveMarks) {
        return alert("Marks cannot be empty or zero");
    }
    details.marks = {
        positiveMarks,
        negativeMarks,
    };

    // Get sections
    const sections = [];
    let dquestions = 0;
    const dsections = document.getElementById("sections").children;

    for (let i = 0; i < dsections.length; i++) {
        const sectionEl = dsections[i];
        const sectionNumber = sectionEl.id.replace("section", "");
        const subject = document.getElementById(`section${sectionNumber}Title`).value.trim();

        if (!subject) {
            return alert(`Section ${sectionNumber} title can't be empty`);
        }

        const questionsCount = Number(document.getElementById(`section${sectionNumber}Questions`).value);
        if (!questionsCount || questionsCount <= 0) {
            return alert(`Section ${sectionNumber} questions count is invalid`);
        }

        dquestions += questionsCount;

        sections.push({ subject, questionsCount });
    }
    details.sections = sections;

    if (dquestions !== totalQuestions) {
        return alert("Total questions not matching sum of sections' questions");
    }

    // Fetch
    fetch(`${BACKEND_URL}/api/setExam/setTemplate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
    })
    .then((response) => {
        if (response.status === 500) {
            throw new Error("Internal Server Error");
        }
        return response.json();
    })
    .then((data) => {
        if (data.code === 3001) {
            throw new Error("Exam title already exists");
        }
        alert("Template has been created successfully");
        
        // Close the modal in the parent page
        const parentDocument = window.parent.document;
        const modal = parentDocument.getElementById('examModal');

        // Use Bootstrap's Modal API to hide it
        const bootstrapModal = window.parent.bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();

        // Reload the parent page
        window.parent.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message);
    });
});

// Auto-update total marks
document.addEventListener('DOMContentLoaded', () => {
    const totalQuestionsInput = document.getElementById('questions');
    const positiveMarksInput = document.getElementById('positiveMarks');
    const totalMarksInput = document.getElementById('marks');

    function updateTotalMarks() {
        const totalQuestions = parseInt(totalQuestionsInput.value) || 0;
        const positiveMarks = parseInt(positiveMarksInput.value) || 0;
        totalMarksInput.value = totalQuestions * positiveMarks;
    }

    totalQuestionsInput.addEventListener('input', updateTotalMarks);
    positiveMarksInput.addEventListener('input', updateTotalMarks);
});