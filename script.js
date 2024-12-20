document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "agent" && password === "hospital123") {
        window.location.href="index2.html"
        // Redirect to another page or perform further actions here
    } else {
        document.getElementById("errorMessage").textContent = "Incorrect username or password.";
    }
});
