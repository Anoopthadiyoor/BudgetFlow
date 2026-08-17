document.addEventListener("DOMContentLoaded", function () {

    const registerForm =
        document.getElementById("registerForm");

    const loginButton =
        document.getElementById("loginButton");


    /* ================= LOGIN REDIRECT ================= */

    loginButton.addEventListener("click", function () {

        window.location.href = "index.html";

    });


    /* ================= REGISTER ================= */

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();


        /* Empty fields */

        if (
            username === "" ||
            email === "" ||
            password === ""
        ) {

            alert("Please fill all the fields.");

            return;
        }


        /* Check existing username */

        if (localStorage.getItem(username) !== null) {

            alert("Username already exists. Please choose another username.");

            return;
        }


        /* Create user */

        const user = {

            username: username,

            email: email,

            password: password,

            income: 0,

            expense: 0,

            incomeArray: [],

            expenseArray: []

        };


        /* Store user */

        localStorage.setItem(
            username,
            JSON.stringify(user)
        );


        alert(
            "Registration successful! Please login."
        );


        window.location.href = "index.html";

    });

});