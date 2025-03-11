document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const strengthMeter = document.getElementById("strength-meter");
    const strengthText = document.getElementById("strength-text");
    const matchText = document.getElementById("match-text");


    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        strengthMeter.className = "strength-meter"; // Reset class

        if (strength === "Weak") {
            strengthMeter.classList.add("weak");
            strengthText.innerText = "Weak";
            strengthText.style.color = "red";
        } else if (strength === "Medium") {
            strengthMeter.classList.add("medium");
            strengthText.innerText = "Medium";
            strengthText.style.color = "orange";
        } else if (strength === "Strong") {
            strengthMeter.classList.add("strong");
            strengthText.innerText = "Strong";
            strengthText.style.color = "green";
        }
    });

    confirmPasswordInput.addEventListener("input", function () {
        if (confirmPasswordInput.value === passwordInput.value) {
            matchText.innerText = "Passwords match";
            matchText.className = "match";
        } else {
            matchText.innerText = "Passwords do not match";
            matchText.className = "mismatch";
        }
    });

    function checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[@$!%*?&]/)) strength++;

        if (strength <= 1) return "Weak";
        if (strength === 2 || strength === 3) return "Medium";
        return "Strong";
    }
});