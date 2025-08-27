const parts = window.location.href.split("/");
const token = parts[parts.length - 1];
console.log(token) ;
document.getElementById(`section${0}`).classList.remove('btn-secondary');
document.getElementById(`section${0}`).classList.add('btn-primary');

let answerMap;
let questionStatus = new Map() ;

document.addEventListener("DOMContentLoaded", async () => {
    // alert(token);
    fetch(`${BACKEND_URL}/api/user/getOptions/${token}`, {
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
        // if(res.status == 500) {
        //     throw new Error("Internal server Error") ;
        // }
        return res.json() ;
    })
    .then(data => {
        console.log(data.data) ;
        answerMap = new Map(data.data) ;
        console.log(answerMap) ;
        displayQuestion() ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
    
    fetch(`${BACKEND_URL}/api/user/getButtonsStatus/${token}`, {
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
        data = data.data ;
        // console.log(data) ;
        // questionStatus = new Map(data) ;
        // console.log(questionStatus) ;
        console.log(data) ;
        for(let i=0;i<data.length;i++) {
            questionStatus.set(data[i].questionId, data[i].type) ;
            if(data[i].type == 0) {
                document.getElementById(`${data[i].questionId}button`).classList.add('btn-secondary');
            }
            else if(data[i].type == 1) {
                document.getElementById(`${data[i].questionId}button`).classList.remove('btn-danger') ;
                document.getElementById(`${data[i].questionId}button`).classList.add('btn-success') ;
            }
            else if(data[i].type == 2) {
                document.getElementById(`${data[i].questionId}button`).classList.add('flagged') ;
            }
            else if(data[i].type == 3){
                document.getElementById(`${data[i].questionId}button`).classList.add('flagged') ;
                document.getElementById(`${data[i].questionId}button`).classList.add('btn-success') ;
            }
            
            document.getElementById(`section${0}question${0}button`).childNodes[1].classList.add('active');
        }
        console.log(questionStatus) ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
    
    fetch(`${BACKEND_URL}/api/user/getTimer/${token}`, {
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
        // if(res.status == 500) {
        //     throw new Error("Internal server Error") ;
        // }
        return res.json() ;
    })
    .then(data => {
        setTimer(data.data) ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
})

document.getElementById("questionBlock").addEventListener("click", (e) => {
    if(e.target.classList.contains("form-check-input")) {
        // alert("working") ;
        let x = document.getElementById(`section${section}question${question}optionsblock`).childElementCount ;
        let value = "" ;
        let optionNumber = -1 ;
        for(let i=0;i<x;i++) {
        let element = document.getElementById(`section${section}question${question}option${i}`) ;
        if(element.checked) {
            value = element.value ;
            optionNumber = i ;
        }
        }
        let question_id = document.getElementById(`section${section}question${question}optionsblock`).parentElement.id ;
        if(answerMap.has(question_id)) {
            let y = answerMap.get(question_id) ;
            if(y == value) {
                return ;
            }
        }

        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('btn-danger');
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-success');
        let z = 1 ;
        if(questionStatus.has(question_id) && (questionStatus.get(question_id) == 2 || questionStatus.get(question_id) == 3)) {
            z = 3 ;
        }
        questionStatus.set(question_id, z) ;
        fetch(`${BACKEND_URL}/api/user/submitAnswer/${token}/${question_id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' ,
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                answer : value,
                type : z
            })
            })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert("question data not saved successfully") ;
        });
    }
})

let hours = 0 ;
let minutes = 0 ;
let seconds = 0 ;
let hoursDisplay = document.getElementById("hours") ;
let minutesDisplay = document.getElementById("minutes") ;
let secondsDisplay = document.getElementById("seconds") ;

function setTimer(time) {
    hours = Math.floor((parseInt(time)/60)) ;
    minutes = parseInt(time)%60 ;
    //alert(hours);
    hoursDisplay.innerText = hours ;
    minutesDisplay.innerText = minutes ;
    secondsDisplay.innerText = seconds ;
    const IntervalId = setInterval(() => {
        if(seconds != 0) {
            seconds = seconds - 1 ;
        }
        else {
            if(minutes != 0) {
                updatetime(hours, minutes) ;
                minutes = minutes-1 ;
                seconds = 59 ;
            }
            else {
                if(hours != 0) {
                    updatetime(hours, minutes) ;
                    hours = hours - 1 ;
                    minutes = 59 ;
                    seconds = 59 ;
                }
                else {
                    clearInterval(IntervalId) ;
                    finalSubmitFunction() ;
                    // clearInterval(IntervalId) ;
                }
            }
        }
        hoursDisplay.innerText = hours ;
        minutesDisplay.innerText = minutes ;
        secondsDisplay.innerText = seconds ;
    }, 1000) ;
}

function updatetime(hours, minutes) {
    let timeRemaining = hours * 60 + minutes ;
    fetch(`${BACKEND_URL}/api/user/updateTimer/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' ,
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            timeRemaining : timeRemaining
        })
        })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // alert("question data not saved successfully") ;
        });

}

document.getElementById("submitButton").addEventListener("click", ()=> {
    finalSubmitFunction() ;
})

function finalSubmitFunction() {
    fetch(`${BACKEND_URL}/api/user/submitTest/${token}`, {
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
        // if(res.status == 500) {
        //     throw new Error("Internal server Error") ;
        // }
        return res.json() ;
    })
    .then(data => {
        alert("test is done") ;
        window.close();
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
}

document.getElementById("section0Questions").classList.remove('d-none');
document.getElementById("section0Questions").classList.add('d-flex');
let section = 0 ;
let question = 0 ;

document.getElementById("previous").addEventListener("click", async() => {
    document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('active');

    if(question == 0) {
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        return;
    }

    document.getElementById(`section${section}question${question}`).style.display = "none";
    question = question - 1;

    document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');

    displayButton(section, question);
    displayQuestion();
});

document.getElementById("next").addEventListener("click", async() => {
    let x = document.getElementById(`section${section}Questions`).childElementCount;
    document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('active');

    if(question == x - 1) {
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        return;
    }

    document.getElementById(`section${section}question${question}`).style.display = "none";
    question = question + 1;

    document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
    displayButton(section, question);
    displayQuestion();
});

document.getElementById("markforreview").addEventListener('click', async(req, res) => {
    let question_id = document.getElementById(`section${section}question${question}optionsblock`).parentElement.id ;
    let x = 2 ;
    if(questionStatus.has(question_id)) {
        let y = questionStatus.get(question_id) ;
        // alert(y) ;
        if(y == 0) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
            x = 2 ;
        }
        else if(y == 1) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
            x = 3 ;
        }
        else if(y == 2) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('flagged');
            x = 0 ;
        }
        else {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('flagged');
            x = 1 ;
        }
    }
    else {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
    }
    // alert(question_id) ;
    // alert(x) ;
    questionStatus.set(question_id, x) ;

    fetch(`${BACKEND_URL}/api/user/markforreview/${token}/${question_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' ,
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            type : x
        })
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("question data not saved successfully") ;
    });
})

function displayQuestion() {
    document.getElementById(`section${section}question${question}`).style.display = "block" ;
    let question_id = document.getElementById(`section${section}question${question}optionsblock`).parentElement.id ;
    if(answerMap.has(question_id)) {
        let data = answerMap.get(question_id) ;
        let x = document.getElementById(`section${section}question${question}optionsblock`).childElementCount ;
        for(let i=0;i<x;i++) {
            let element = document.getElementById(`section${section}question${question}option${i}`) ;
            let y = element.value ;
            if(y == data) {
                element.checked = true ;
            }
        }
    }
    if(questionStatus.has(question_id)) {
        let x = questionStatus.get(question_id) ;
        // alert(x) ;
        if(x == 0) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger') ;
        }
        else if(x == 1) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-success');
        }
        else if(x == 2) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger');
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
        }
        else if(x == 3) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-success');
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
        }
    }
    else {
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger') ;
    }
    document.getElementById("question_number").innerText = `Question-${question+1}` ;
}

document.getElementById("questionButtonsBlock").addEventListener("click", async(e) => {
    if (e.target.classList.contains("questionButtons")) {
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('active');

        let str = e.target.parentElement.id;
        document.getElementById(`section${section}question${question}`).style.display = "none";
        await displayButton(section, question);
        section = parseInt(str.split("section")[1].split("question")[0]);
        question = parseInt(str.split("question")[1].split("button")[0]);

        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        displayQuestion();
    }
});

async function displayButton(section, question) {
    let question_id = document.getElementById(`section${section}question${question}optionsblock`).parentElement.id ;
    if(questionStatus.has(question_id)) {
        let x = questionStatus.get(question_id) ;
        if(x == 0) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger') ;
        }
        else if(x == 1) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-success');
        }
        else if(x == 2) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger');
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
        }
        else if(x == 3) {
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-success');
            document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('flagged');
        }
    }
    else {
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('btn-danger') ;
    }
}

document.getElementById("sectionsBlock").addEventListener("click", (e) => {
    if (e.target.classList.contains("sectionButtons")) {
        let str = e.target.id;
        const sectionNumber = parseInt(str.slice(7));

        document.getElementById(`section${section}`).classList.remove('btn-primary');
        document.getElementById(`section${section}`).classList.add('btn-secondary');

        document.getElementById(`section${section}Questions`).classList.remove('d-flex');
        document.getElementById(`section${section}Questions`).classList.add('d-none');

        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.remove('active');

        document.getElementById(`section${section}question${question}`).style.display = "none";
        section = parseInt(str.slice(7));
        question = 0;

        document.getElementById(`section${section}`).classList.remove('btn-secondary');
        document.getElementById(`section${section}`).classList.add('btn-primary');

        document.getElementById(`section${section}Questions`).classList.remove('d-none');
        document.getElementById(`section${section}Questions`).classList.add('d-flex');

        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        displayQuestion();
    }
});

document.getElementById("reset").addEventListener("click", () => {
    resetFunction(section, question) ;
})

function resetFunction(givenSection, givenQuestion) {
    let x = document.getElementById(`section${givenSection}question${givenQuestion}optionsblock`).childElementCount ;
    let value = "" ;
    let optionNumber = -1 ;
    for(let i=0;i<x;i++) {
        let element = document.getElementById(`section${givenSection}question${givenQuestion}option${i}`) ;
        if(element.checked) {
            element.checked = false ;
            // value = element.value ;
            // optionNumber = i ;
        }
    }
    
    let question_id = document.getElementById(`section${givenSection}question${givenQuestion}optionsblock`).parentElement.id ;
    answerMap.set(question_id, value) ;
    fetch(`${BACKEND_URL}/api/user/submitAnswer/${token}/${question_id}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' ,
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
        answer : value,
        type : 0
    })
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("question data not saved successfully") ;
    });
    
    document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.remove("btn-success");
    document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.add("btn-danger");
    
    return ;
}