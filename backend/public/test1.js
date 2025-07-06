localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImVtYWlsSWQiOiJrdXNod2FudGhzaXN0dUBnbWFpbC5jb20iLCJpYXQiOjE3NTA4NTYxNTQsImV4cCI6MTc1MDg5MjE1NH0.slQxK_8asPjbEItttA-WBjZ1H4BRza7oSu8tT9Z6r_s");
const parts = window.location.href.split("/");
const examId = parts[parts.length - 1];
//document.getElementById(`section${0}`).style.backgroundColor = "yellow" ;
document.getElementById(`section${0}`).classList.remove('btn-secondary');
document.getElementById(`section${0}`).classList.add('btn-primary');

let answerMap;

document.addEventListener("DOMContentLoaded", async () => {
    const parts = window.location.href.split("/");
    const examId = parts[parts.length - 1];
    fetch(`http://localhost:3000/api/user/getOptions/${examId}`, {
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
        answerMap = new Map(data.data) ;
        console.log(answerMap) ;
        displayQuestion() ;
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
    
    fetch(`http://localhost:3000/api/user/getButtonsStatus/${examId}`, {
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
        console.log(data) ;
        for(let i=0;i<data.length;i++) {
            if(data[i].type == 1) {
                //document.getElementById(`${data[i].questionId}button`).style.backgroundColor = "green" ;
                document.getElementById(`${data[i].questionId}button`).classList.remove('btn-secondary');
                document.getElementById(`${data[i].questionId}button`).classList.remove('btn-success');
            }
            else {
                //document.getElementById(`${data[i].questionId}button`).style.backgroundColor = "purple" ;
                document.getElementById(`${data[i].questionId}button`).classList.add('flagged');
            }
            //document.getElementById(`section${0}question${0}button`).childNodes[1].style.backgroundColor = "blue" ;
            document.getElementById(`section${0}question${0}button`).childNodes[1].classList.add('active');
        }
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
    
    fetch(`http://localhost:3000/api/user/getTimer/${examId}`, {
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
    fetch(`http://localhost:3000/api/user/updateTimer/${examId}`, {
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
    fetch(`http://localhost:3000/api/user/submitTest/${examId}`, {
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
    })
    .catch(err => {
        // console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });

}

//document.getElementById("section0Questions").style.display = "block" ;
document.getElementById("section0Questions").classList.remove('d-none');
document.getElementById("section0Questions").classList.add('d-flex');
let section = 0 ;
let question = 0 ;

document.getElementById("previous").addEventListener('click', async(req, res) => {
    saveQuestion(1, section, question) ;
    if(question == 0) {
        //document.getElementById(`section${section}question${question}button`).childNodes[1].style.backgroundColor = "blue" ;
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        return 0 ;
    }
    document.getElementById(`section${section}question${question}`).style.display = "none" ;
    question = question - 1 ;
    displayQuestion() ;
})
document.getElementById("markforreview").addEventListener('click', async(req, res) => {
    saveQuestion(2, section, question) ;
    let x = document.getElementById(`section${section}Questions`).childElementCount ;
    if(question == x-1) {
        //document.getElementById(`section${section}question${question}button`).childNodes[1].style.backgroundColor = "blue" ;
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        return ;
    }
    document.getElementById(`section${section}question${question}`).style.display = "none" ;
    question = question + 1 ;
    displayQuestion(document.getElementById(`section${section}question${question}button`).childNodes[1]) ;
})
function saveQuestion(type, givenSection, givenQuestion) {
    let x = document.getElementById(`section${givenSection}question${givenQuestion}optionsblock`).childElementCount ;
    let value = "" ;
    let optionNumber = -1 ;
    for(let i=0;i<x;i++) {
        let element = document.getElementById(`section${givenSection}question${givenQuestion}option${i}`) ;
        if(element.checked) {
            value = element.value ;
            optionNumber = i ;
        }
    }
    let question_id = document.getElementById(`section${givenSection}question${givenQuestion}optionsblock`).parentElement.id ;
    answerMap.set(question_id, value) ;
    if(optionNumber == -1) {
        fetch(`http://localhost:3000/api/user/submitAnswer/${question_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' ,
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            examId : examId,
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
        //document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].style.backgroundColor = "white" ;
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.remove('active');
        return ;
    }
    if(type == 1) {
        //document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].style.backgroundColor = "green" ;
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.remove('btn-secondary');
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.remove('active');
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.add('btn-success');
    }
    else if(type == 2) {
        //document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].style.backgroundColor = "purple" ;
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.add('flagged');
    }
    else {
        //document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].style.backgroundColor = "white" ;
        document.getElementById(`section${givenSection}question${givenQuestion}button`).childNodes[1].classList.remove('active');
    }
    // let question_id = document.getElementById(`section${givenSection}question${givenQuestion}optionsblock`).parentElement.id ;
    // alert(question_id) ;
    fetch(`http://localhost:3000/api/user/submitAnswer/${question_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' ,
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            examId : examId,
            answer : value,
            type : type
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

document.getElementById("saveandnext").addEventListener("click", async(req, res) => {
    saveQuestion(1, section, question) ;
    let x = document.getElementById(`section${section}Questions`).childElementCount ;
    if(question == x-1) {
        //document.getElementById(`section${section}question${question}button`).childNodes[1].style.backgroundColor = "blue" ;
        document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
        return ;
    }
    document.getElementById(`section${section}question${question}`).style.display = "none" ;
    question = question + 1 ;
    displayQuestion() ;
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
    //document.getElementById(`section${section}question${question}button`).childNodes[1].style.backgroundColor = "blue" ;
    document.getElementById(`section${section}question${question}button`).childNodes[1].classList.add('active');
}


document.getElementById("questionButtonsBlock").addEventListener("click", async(e) => {
if (e.target.classList.contains("questionButtons")){
//if(e.target.className == "questionButtons") {
    saveQuestion(1, section, question) ;
    let str = e.target.parentElement.id ;
    document.getElementById(`section${section}question${question}`).style.display = "none" ;
    section = parseInt(str.split("section")[1].split("question")[0]);
    question = parseInt(str.split("question")[1].split("button")[0]);
    displayQuestion() ;
}
})

document.getElementById("sectionsBlock").addEventListener("click", (e) => {
if (e.target.classList.contains("sectionButtons")) {
//if(e.target.className == "sectionButtons") {
    saveQuestion(1, section, question) ;
    let str = e.target.id ;
    const sectionNumber = parseInt(str.slice(7));

    //document.getElementById(`section${section}`).style.backgroundColor = "white" ;
    document.getElementById(`section${section}`).classList.remove('btn-primary');
    document.getElementById(`section${section}`).classList.add('btn-secondary');
    

    //document.getElementById(`section${section}Questions`).style.display = "none" ;
    document.getElementById(`section${section}Questions`).classList.remove('d-flex');
    document.getElementById(`section${section}Questions`).classList.add('d-none');

    document.getElementById(`section${section}question${question}`).style.display = "none" ;
    section = parseInt(str.slice(7));
    question = 0 ;
    
    //document.getElementById(`section${section}`).style.backgroundColor = "yellow" ;
    document.getElementById(`section${section}`).classList.remove('btn-secondary');
    document.getElementById(`section${section}`).classList.add('btn-primary');
    
    //document.getElementById(`section${section}Questions`).style.display = "block" ;
    document.getElementById(`section${section}Questions`).classList.remove('d-none');
    document.getElementById(`section${section}Questions`).classList.add('d-flex');
    
    displayQuestion() ;
}
})