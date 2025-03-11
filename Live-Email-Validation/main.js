function validateEmail() {
    const emailInput = document.getElementById("email");
    const message = document.getElementById("message");
    const statusIcon = document.getElementById("status-icon");

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(emailInput.value)) {
        message.innerText = "Valid Email ✔";
        message.className = "valid";
        statusIcon.innerText = "✅";
        statusIcon.style.color = "green";
    } else {
        message.innerText = "Invalid Email ❌";
        message.className = "invalid";
        statusIcon.innerText = "❌";
        statusIcon.style.color = "red";
    }

    if (emailInput.value === "") {
        message.innerText = "";
        statusIcon.innerText = "⚪";
        statusIcon.style.color = "#bbb";
    }
}
