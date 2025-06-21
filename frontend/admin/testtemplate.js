let sectionCount = 1 ;
function deleteButtonFunction(sectionNumber) {
    if(sectionCount === 1) {
        alert("sections count cannot be zero") ; 
        return ;
    }
    document.getElementById(`section${sectionNumber}`).remove() ;
    sectionCount = sectionCount - 1 ;
}

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

document.getElementById('createTestButton').addEventListener('click', () => {
    let details = {} ;
    let title = document.getElementById("title").value ;
    if(title.length === 0) {
        alert("title can't be empty") ; 
        return ;
    }
    details.title = title ;

    let totalQuestions = document.getElementById("questions").value ;
    if(!totalQuestions) {
        alert("total questions can't be empty") ; 
        return ;
    }
    details.totalQuestions = totalQuestions ;

    let timeDuration = document.getElementById("timeDuration").value ;
    if(!timeDuration) {
        alert("time duration can't be empty") ; 
        return ;
    }
    if(timeDuration == 0) {
        alert("time can't be zero") ; 
        return ;
    }
    details.timeDuration = timeDuration ;

    let positiveMarks = document.getElementById("positiveMarks").value ;
    if(!positiveMarks) {
        alert("positive marks can't be empty") ; 
        return ;
    }
    let negativeMarks = document.getElementById("negativeMarks").value ;
    if(!negativeMarks) {
        alert("negative marks can't be empty") ; 
        return ;
    }
    details.marks = {
        positiveMarks : positiveMarks, 
        negativeMarks : negativeMarks 
    }

    let sections = [] ;
    let dsections = document.getElementById("sections").children ;
    let dmarks = 0, dquestions = 0 ;
    for(let i=0;i<dsections.length;i++) {
        let x = {} ;
        let section = dsections[i] ;
        let sectionNumber = section.id.slice(7) ;
        let title = document.getElementById(`section${sectionNumber}Title`).value ;
        if(title.length == 0) {
            alert("section title can't be empty") ; 
            return ;
        }
        x.subject = title ;
        let questions = document.getElementById(`section${sectionNumber}Questions`).value ;
        if(!questions || questions == 0) {
            alert("invalid questions count") ; 
            return ;
        }
        dquestions = Number(dquestions) + Number(questions) ;
        x.questionsCount = questions ;
        
        /* let marks = document.getElementById(`section${sectionNumber}Marks`).value ;
        if(!marks || marks == 0) {
            alert("invalid marks count") ; 
            return ;
        }
        dmarks = Number(dmarks) + Number(marks) ;
        x.marks = marks ; */
        
        sections.push(x) ;
    }
    details.sections = sections ;

    if(dquestions != totalQuestions) {
        alert("total questions not matching with individual marks") ; 
        return ;
    }

    fetch('http://localhost:3000/api/setExam/setTemplate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // or 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(details)
    })
    .then(response => {
        if(response.status == 500) {
            throw new Error("Internal Server Error") ;
        }
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        return response.json(); // or response.text() if it's plain text
    })
    .then(data => {
        if(data.code == 3001) {
            throw new Error("exam title already exits")
        }
        alert("Template has been created successfully")
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message) ;
    });
})

// Update Total marks
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