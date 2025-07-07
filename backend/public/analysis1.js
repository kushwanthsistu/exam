const parts = window.location.href.split("/") ;
const token = parts[parts.length - 1] ; 
let section = -1 ;
let question = -1 ;
let storeddata = [] ;
// let correctAnswers ;
// let wrongAnswers ;
// alert(token) ;

document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/api/user/getQuestionStatus/${token}`, {
    method: 'GET',
    })
    .then(res => {
        // if(res.status == 500) {
        //     throw new Error("Internal server Error") ;
        // }
        return res.json() ;
    })
    .then(data => {
        let correctAnswers = data.data.correctAnswers ;
        let wrongAnswers = data.data.wrongAnswers ;
        for(let i=0;i<correctAnswers.length;i++) {
            //document.getElementById(`${correctAnswers[i]}button`).style.backgroundColor = "green" ;
            document.getElementById(`${correctAnswers[i]}button`).classList.remove("btn-secondary");
            document.getElementById(`${correctAnswers[i]}button`).classList.add("btn-success");
        }
        for(let i=0;i<wrongAnswers.length;i++) {
            //document.getElementById(`${wrongAnswers[i]}button`).style.backgroundColor = "red" ;
            document.getElementById(`${wrongAnswers[i]}button`).classList.remove("btn-secondary");
            document.getElementById(`${wrongAnswers[i]}button`).classList.add("btn-danger");
        }
    })
    .catch(err => {
        console.log(error) ;
        alert("Internal Server Error, unable to load the details. try refreshing the page")
    });
})

document.getElementById("sectionsBlock").addEventListener("click", (e) => {
    //if(e.target.className == "sectionButtons") {
    if (e.target.classList.contains("sectionButtons")) {
        let id = e.target.id ;
        let num = id.match(/\d+/);
        if(section != -1) {
            //document.getElementById(`section${section}`).style.backgroundColor = "white" ;
            document.getElementById(`section${section}`).classList.remove("active");
            //document.getElementById(`section${section}Questions`).style.display = "none" ;
            document.getElementById(`section${section}Questions`).classList.remove("d-flex");
            document.getElementById(`section${section}Questions`).classList.add("d-none");
        }
        if(question != -1) {
            //document.getElementById(`section${section}question${question}`).style.display = "none" ;
            document.getElementById(`section${section}question${question}`).classList.remove("d-flex");
            document.getElementById(`section${section}question${question}`).classList.add("d-none");
        }
        section = num ;
        //document.getElementById(`section${section}`).style.backgroundColor = "yellow" ;
        document.getElementById(`section${section}`).classList.add("active");
        //document.getElementById(`section${section}Questions`).style.display = "block" ;
        document.getElementById(`section${section}Questions`).classList.remove("d-none");
        document.getElementById(`section${section}Questions`).classList.add("d-flex");
    }
})

document.getElementById("questionButtonsBlock").addEventListener('click', (e) => {
    //if(e.target.className == "questionButtons") {
    if (e.target.classList.contains("questionButtons")) {
        if(section == -1) {
            alert("select a section first") ;
            return ;
        }
        if(question != -1) {
            //document.getElementById(`section${section}question${question}`).style.display = "none" ;
            document.getElementById(`section${section}question${question}`).classList.remove("d-flex");
            document.getElementById(`section${section}question${question}`).classList.add("d-none");
        }
        let id = e.target.id.match(/^([a-f0-9]{24})button$/)[1];
        let str = e.target.parentElement.id ;
        section = parseInt(str.split("section")[1].split("question")[0]);
        question = parseInt(str.split("question")[1].split("button")[0]);

        //document.getElementById(`section${section}question${question}`).style.display = "block" ;
        document.getElementById(`section${section}question${question}`).classList.remove("d-none");
        document.getElementById(`section${section}question${question}`).classList.add("d-flex");
 
        if(storeddata.includes(id)) {
            return;
        }
        fetch(`http://localhost:3000/api/user/getAnswers/${token}/${id}`, {
            method: 'GET',
        })
        .then(res => {
            if (res.status == 500) {
                throw new Error("Internal server Error");
            }
            return res.json();
        })
        .then(data => {
            const markedAnswerInput = document.getElementById(`section${section}question${question}markedAnswer`);
            if (!data.status || !data.data.answer) {
                markedAnswerInput.value = "Not answered";
            } else {
                markedAnswerInput.value = data.data.answer;
            }
            storeddata.push(id);
        })
        .catch(err => {
            console.log(err);
            alert("Internal Server Error, unable to load the details. Try refreshing the page.");
        });
    }
})