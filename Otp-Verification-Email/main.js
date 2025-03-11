let generatedOTP = "";

function sendOTP() {
    const emailInput = document.getElementById("email").value;
    if (!emailInput.includes("@")) {
        document.getElementById("message").innerText = "Enter a valid email!";
        return;
    }

    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Generated OTP:", generatedOTP);  // Simulating email sending

    document.getElementById("email-section").style.display = "none";
    document.getElementById("otp-section").style.display = "block";
    document.getElementById("message").innerText = "OTP sent to your email!";
}

function verifyOTP() {
    const enteredOTP = document.getElementById("otp").value;
    if (enteredOTP === generatedOTP) {
        document.getElementById("message").innerText = "✅ Verified Successfully!";
        document.getElementById("message").style.color = "green";
    } else {
        document.getElementById("message").innerText = "❌ Invalid OTP!";
        document.getElementById("message").style.color = "red";
    }
}
