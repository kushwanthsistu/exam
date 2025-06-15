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