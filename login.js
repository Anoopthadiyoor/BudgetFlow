document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const registerButton = document.getElementById("registerButton");


    /* ================= REGISTER REDIRECT ================= */

    registerButton.addEventListener("click", function () {

        window.location.href = "register.html";

    });


    /* ================= LOGIN ================= */

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();


        if (username === "" || password === "") {

            alert("Please enter username and password.");

            return;
        }


        const userData = localStorage.getItem(username);


        /* Username does not exist */

        if (userData === null) {

            alert("Username does not exist.");

            return;
        }


        const user = JSON.parse(userData);


        /* Wrong password */

        if (user.password !== password) {

            alert("Incorrect password.");

            return;
        }


        /* Save currently logged-in user */

        localStorage.setItem("currentUser", username);

        window.location.href = "home.html";

    });

});