let section = 0;
let questionNumber = 1;
let buttonsDisabled = false;
let questionInformation = {};
let questionBlock = document.getElementById("questionBlock");

const parts = window.location.href.split("/");
const examId = parts[parts.length - 1];

// Show first section's questions and highlight active buttons
document.getElementById(`section${section}Questions`).style.display = "block";
highlightSection(section);
highlightQuestion(section, questionNumber);

document.getElementById("sectionBlock").addEventListener("click", (e) => {
    if (buttonsDisabled) return;

    if (e.target.classList.contains("questionButtons")) {
        submitFunction();
        questionNumber = parseInt(e.target.id.split("_")[1]);
        fetchQuestion();
        highlightQuestion(section, questionNumber);
    }
});

document.getElementById("sectionsBar").addEventListener("click", (e) => {
    if (e.target.classList.contains("subjectbuttons")) {
        submitFunction();
        // Hide current section's question buttons
        document.getElementById(`section${section}Questions`).style.display = "none";

        section = parseInt(e.target.id.slice(7));
        questionNumber = 1;

        // Show new section's question buttons
        document.getElementById(`section${section}Questions`).style.display = "block";
        fetchQuestion();

        // Update active button styles
        highlightSection(section);
        highlightQuestion(section, questionNumber);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    fetchQuestion();
});

document.getElementById("questionBlock").addEventListener('click', (e) => {
    if (e.target.id == "addOptionButton") {
        addOptionsFunction(false, {});
    }

    if (e.target.id == "optionRemovalButton") {
        e.target.parentElement.remove();
    }

    if (e.target.id == "submitButton") {
        submitFunction();
    }
});

document.getElementById("uploadButton").addEventListener("click", () => {
    submitFunction();
    fetch(`${BACKEND_URL}/api/admin/uploadTest/${examId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status == 500) {
                    alert("Internal Server Error");
                    throw new Error('Internal Server Error');
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                alert("Paper is uploaded successfully");
                window.close();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});


function highlightSection(activeIndex) {
    const sectionButtons = document.querySelectorAll(".subjectbuttons");
    sectionButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    });

    const activeBtn = document.getElementById(`section${activeIndex}`);
    if (activeBtn) {
        activeBtn.classList.remove("btn-secondary");
        activeBtn.classList.add("btn-primary");
    }
}

function highlightQuestion(sectionIndex, activeNumber) {
    const questionButtons = document.querySelectorAll(`#section${sectionIndex}Questions .questionButtons`);
    questionButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    });

    const activeBtn = document.getElementById(`section${sectionIndex}Question_${activeNumber}`);
    if (activeBtn) {
        activeBtn.classList.remove("btn-secondary");
        activeBtn.classList.add("btn-primary");
    }
}

function fetchQuestion() {
    fetch(`${BACKEND_URL}/api/admin/getQuestion/${examId}/${section}/${questionNumber}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            questionInformation = data.data;
            if (data.code == 2001) {
                displayEmpty();
            }
            if (data.code == 1001) {
                displayEmpty();
                displayQuestion(data.data);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function displayQuestion(data) {
    document.getElementById("questionStatement").value = data.statement;
    for (let i = 0; i < data.options.length; i++) {
        addOptionsFunction(true, data.options[i]);
    }
    document.getElementById("answerGiven").value = data.correctAnswer;
}

function displayEmpty() {
    if (document.getElementById("question")) {
        document.getElementById("question").remove();
    }

    let element = document.createElement("div");
    element.id = "question";
    element.className = "d-flex flex-column flex-grow-1 h-100 overflow-auto";
    element.style.minHeight = "0";
    element.innerHTML = `
        <div class="d-flex flex-column flex-grow-1 overflow-auto" style="overflow-y: auto; overflow-x: hidden; min-height:0;">
            <div class="row mb-2 w-100 px-3 py-1">
                <label for="questionStatement" class="col-12">Question</label>
                <div>
                    <textarea id="questionStatement" class="form-control col-12" rows="3" placeholder="Write the question here" required></textarea>
                </div>
            </div>
            <div class="row mb-2 w-100 px-3 py-1">
                <label for="answerGiven" class="col-12">Correct answer</label>
                <div>
                    <input type="text" id="answerGiven" class="form-control col-12" placeholder="Write the correct answer here" required>
                </div>
            </div>
            <div class="row mb-2 w-100 px-3 py-1">
                <div class="d-inline-flex mb-2 col-12 gap-3 w-100">
                    <label for="options" class="form-label">Options</label>
                    <button type="button" id="addOptionButton" class="btn btn-primary">+</button>
                </div>
            </div>
            <div id="options" class="row mb-2 w-100 px-3 py-1"></div>
        </div>
        <div class="middle-bottom-part row w-100 auto">
            <div class="col-12 d-flex justify-content-center mb-2">
                <button id="submitButton" type="button" class="btn btn-success">Submit</button>
            </div>
        </div>
    `;
    questionBlock.appendChild(element);
}

function addOptionsFunction(f, optionValue) {
    let value = f ? optionValue : "";
    let element = document.createElement("div");
    element.className = "d-inline-flex mb-2 col-12 gap-2 w-100";
    element.innerHTML = `
        <input type="text" class="givenOptions form-control" value="${value}" placeholder="Write options here" required>
        <button id="optionRemovalButton" class="btn btn-danger">-</button>
    `;
    document.getElementById("options").appendChild(element);
}

async function submitFunction() {
    buttonsDisabled = true;
    let complete = true;
    let question = { updated: [] };

    let statement = document.getElementById("questionStatement").value;
    if (!statement) complete = false;
    if (statement !== questionInformation.statement) {
        question.statement = statement;
        question.updated.push("statement");
    }

    let givenOptions = document.getElementsByClassName("givenOptions form-control");
    if (givenOptions.length < 2) complete = false;

    let options = [];
    for (let input of givenOptions) {
        if (!input.value) complete = false;
        options.push(input.value);
    }

    if (JSON.stringify(options) !== JSON.stringify(questionInformation.options)) {
        question.options = options;
        question.updated.push("options");
    }

    let answer = document.getElementById("answerGiven").value;
    if (!answer || !options.includes(answer)) complete = false;

    if (questionInformation.correctAnswer !== answer) {
        question.correctAnswer = answer;
        question.updated.push("correctAnswer");
    }

    question.complete = complete;

    fetch(`${BACKEND_URL}/api/admin/saveQuestion/${examId}/${section}/${questionNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
    })
    .then(response => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        buttonsDisabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Internal Server Error");
    });
}