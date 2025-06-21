function createStructure(data, container, status) {
    data = data.data;

    for(let i = 0; i < data.length; i++){
        console.log(data[i]);

        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mt-2";
        colDiv.innerHTML = `
            <div class="card">
                <h1 class="card-title ${status ? 'bg-primary' : 'bg-secondary'} text-white rounded">${data[i].title}</h1>
                <div class="card-body">
                    <p>Duration: HH:MM:SS </p>

                    <div class="row">
                        <div class="d-flex justify-content-center col-12 col-lg-4 mt-3">
                            <button class="btn btn-info">Edit Test</button>
                        </div>

                        <div class="d-flex justify-content-center col-12 col-lg-4 mt-3">
                            <button class="btn btn-warning">View Statistics</button>    
                        </div>

                        <div class="d-flex justify-content-center col-12 col-lg-4 mt-3">
                            <button class="btn ${status ? 'btn-danger' : 'btn-success'} statusChangingButton" id=${data[i]._id}>${status ? 'Disable' : 'Enable'} Test</button>    
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(colDiv) ;
    }   
}

document.addEventListener("DOMContentLoaded", async () => {
    fetch('http://localhost:3000/api/admin/getOngoingTests')
    .then(response => response.json())
    .then(data => {
        // alert("Got the data successfully");
        console.log(data) ;
        const container = document.getElementById("ongoingExamContainer");
        let colDiv = createStructure(data, container, true) ; 
        // container.appendChild(colDiv);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

    fetch('http://localhost:3000/api/admin/getDisabledTests')
    .then(response => response.json())
    .then(data => {
        // alert("Got the data successfully");
        console.log(data) ;
        const container = document.getElementById("expiredExamContainer");
        let colDiv = createStructure(data, container, false) ;
        // container.appendChild(colDiv);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

    // Delegate clicks from ongoingExamContainer
    document.getElementById("ongoingExamContainer").addEventListener("click", function(e){
        if(e.target && e.target.classList.contains("statusChangingButton")){
            fetch(`http://localhost:3000/api/admin/disableTest/${e.target.id}`)
            .then(response => {
                if(response.status != 200){
                    alert("Internal Server Error!! try later")
                }
                response.json();
            })
            .then(data => {
                location.reload();
            })
        }
    });

    // Delegate clicks from expiredExamContainer
    document.getElementById("expiredExamContainer").addEventListener("click", function(e){
        if (e.target && e.target.classList.contains("statusChangingButton")){
            fetch(`http://localhost:3000/api/admin/enableTest/${e.target.id}`)
            .then(response => {
                if(response.status != 200){
                    alert("Internal Server Error!! try later")
                }
                response.json();
            })
            .then(data => {
                location.reload();
            })
        }
    });
});