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
            document.getElementById(`${correctAnswers[i]}button`).style.backgroundColor = "green" ;
        }
        for(let i=0;i<wrongAnswers.length;i++) {
            document.getElementById(`${wrongAnswers[i]}button`).style.backgroundColor = "red" ;
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
            document.getElementById(`section${section}`).style.backgroundColor = "white" ;
            document.getElementById(`section${section}Questions`).style.display = "none" ;
        }
        if(question != -1) {
            document.getElementById(`section${section}question${question}`).style.display = "none" ;
        }
        section = num ;
        document.getElementById(`section${section}`).style.backgroundColor = "yellow" ;
        document.getElementById(`section${section}Questions`).style.display = "block" ;
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
            document.getElementById(`section${section}question${question}`).style.display = "none" ;
        }
        let id = e.target.id.match(/^([a-f0-9]{24})button$/)[1];
        let str = e.target.parentElement.id ;
        section = parseInt(str.split("section")[1].split("question")[0]);
        question = parseInt(str.split("question")[1].split("button")[0]);
        document.getElementById(`section${section}question${question}`).style.display = "block" ;
        if(storeddata.includes(id)) {
            return ;
        }
        fetch(`http://localhost:3000/api/user/getAnswers/${token}/${id}`, {
        method: 'GET',
        })
        .then(res => {
            if(res.status == 500) {
                throw new Error("Internal server Error") ;
            }
            return res.json() ;
        })
        .then(data => {
            if(!data.status) {
                document.getElementById(`section${section}question${question}answer`).innerHTML = "not answered" ;
                return ;
            }
            data = data.data ;
            if(data.type == 2) {
                document.getElementById(`section${section}question${question}marked`).innerHTML = "Marked For Review" ;
            } 
            console.log(data.answer) ;
            if(data.answer) {
                document.getElementById(`section${section}question${question}answer`).innerHTML = `answered : ${data.answer}` ;
            }
            else {
                document.getElementById(`section${section}question${question}answer`).innerHTML = "not answered" ;
            }
            storeddata.push(id) ;
        })
        .catch(err => {
            console.log(error) ;
            alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
    }
})