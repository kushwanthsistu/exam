let token = localStorage.getItem("token") ;
// console.log(token) ;
if(!localStorage.getItem('token')){
    location.href='ISE.html';
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/api/user/getProfile`, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then(res => {
            // console.log("working till here") ;
            if(res.status == 500) {
                throw new Error("Internal server Error") ;
            }
            return res.json() ;
        })
        .then(data => {
            // alert(data.data) ;
            data = data.data ;
            document.getElementById("userName").innerHTML = data.name ;
            document.getElementById("userEmail").innerHTML = data.emailId ;
        })
        .catch(err => {
            // console.log(error) ;
            alert("Internal Server Error, unable to load the details. try refreshing the page")
        });
})

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('token');
    location.href='login.html' ;
})

function showSuccessMessage() {
    const message = document.getElementById("successMessage");

    // Reset visibility and opacity
    message.classList.remove("d-none", "fade-out");
    message.classList.add("fade-in");

    // Remove the message after a delay (optional)
    setTimeout(() => {
        message.classList.remove("fade-in");
        message.classList.add("fade-out");
        setTimeout(() => {
            message.classList.add("d-none");
        }, 500); // match CSS transition duration
    }, 2000); // message visible for 2 seconds
}