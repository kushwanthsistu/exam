import { FRONTEND_URL, BACKEND_URL } from "../config.js";

// Get testId from query params
const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get("testId");

// Fetch statistics and render
fetch(`${BACKEND_URL}/api/admin/testAnalysis/${testId}`)
    .then(response => response.json())
    .then(data => {
        if (!data.status) {
            alert("No statistics found!");
            return;
        }

        const result = data.data;

        // Render stats as plain text lines instead of cards
        const statsContainer = document.getElementById("statsCards");
        statsContainer.innerHTML = `
            <p><strong>Total Participants:</strong> ${result.totalParticipants}</p>
            <p><strong>Total Marks:</strong> ${result.totalMarks}</p>
            <p><strong>Average Marks:</strong> ${result.averageMarks}</p>
            <p><strong>Highest Marks:</strong> ${result.maxMarks}</p>
            <p><strong>Lowest Marks:</strong> ${result.minMarks}</p>
        `;

        // Render participants table
        const tableBody = document.getElementById("participantsTableBody");
        tableBody.innerHTML = "";

        result.participants.forEach((participant, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${participant.name}</td>
                    <td>${participant.marksScored}</td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error("Error loading statistics:", error);
        alert("Failed to load statistics");
    });
