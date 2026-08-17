document.addEventListener("DOMContentLoaded", function () {


    /* ================= GET CURRENT USER ================= */

    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "index.html";

        return;
    }


    /* ================= GET USER DATA ================= */

    let user =
        JSON.parse(localStorage.getItem(currentUser));


    if (!user) {

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

        return;
    }


    /* ================= ELEMENTS ================= */

    const welcomeUser =
        document.getElementById("welcomeUser");

    const balanceElement =
        document.getElementById("balance");

    const expenseElement =
        document.getElementById("expense");


    const incomeType =
        document.getElementById("incomeType");

    const incomeAmount =
        document.getElementById("incomeAmount");


    const expenseType =
        document.getElementById("expenseType");

    const expenseAmount =
        document.getElementById("expenseAmount");


    const incomeTableBody =
        document.getElementById("incomeTableBody");

    const expenseTableBody =
        document.getElementById("expenseTableBody");


    const addIncomeButton =
        document.getElementById("addIncomeButton");

    const addExpenseButton =
        document.getElementById("addExpenseButton");


    const resetButton =
        document.getElementById("resetButton");


    const logoutButton =
        document.getElementById("logoutButton");


    const chartButton =
        document.getElementById("chartButton");


    const chartContainer =
        document.querySelector(".chart-container");


    let expenseChart = null;


    /* ================= INITIALIZE ================= */

    welcomeUser.textContent = user.username;

    updateDashboard();


    /* ================= ADD INCOME ================= */

    addIncomeButton.addEventListener(
        "click",
        function () {


            const type =
                incomeType.value;


            const amount =
                Number(incomeAmount.value);


            if (type === "") {

                alert("Please select an income type.");

                return;
            }


            if (!amount || amount <= 0) {

                alert("Please enter a valid income amount.");

                return;
            }


            /* Increase income */

            user.income += amount;


            /* Store transaction */

            const transaction = {

                type: type,

                amount: amount,

                balance: user.income - user.expense,

                date:
                    new Date().toLocaleString()

            };


            user.incomeArray.push(transaction);


            /* Save */

            saveUser();


            /* Update */

            updateDashboard();


            /* Clear */

            incomeType.value = "";

            incomeAmount.value = "";


            alert(
                "Income of Rs " +
                amount +
                " added successfully!"
            );

        }
    );


    /* ================= ADD EXPENSE ================= */

    addExpenseButton.addEventListener(
        "click",
        function () {


            const type =
                expenseType.value;


            const amount =
                Number(expenseAmount.value);


            if (type === "") {

                alert("Please select an expense type.");

                return;
            }


            if (!amount || amount <= 0) {

                alert("Please enter a valid expense amount.");

                return;
            }


            /* Increase expense */

            user.expense += amount;


            /* Store transaction */

            const transaction = {

                type: type,

                amount: amount,

                balance: user.income - user.expense,

                date:
                    new Date().toLocaleString()

            };


            user.expenseArray.push(transaction);


            /* Save */

            saveUser();


            /* Update */

            updateDashboard();


            /* Clear */

            expenseType.value = "";

            expenseAmount.value = "";


            alert(
                "Expense of Rs " +
                amount +
                " added successfully!"
            );

        }
    );


    /* ================= RESET ================= */

    resetButton.addEventListener(
        "click",
        function () {


            const confirmation =
                confirm(
                    "Are you sure you want to clear all income and expense data?"
                );


            if (!confirmation) {

                return;
            }


            /* Clear financial data */

            user.income = 0;

            user.expense = 0;

            user.incomeArray = [];

            user.expenseArray = [];


            /* Save account */

            saveUser();


            /* Update page */

            updateDashboard();


            /* Remove chart */

            chartContainer.classList.remove("show");


            if (expenseChart) {

                expenseChart.destroy();

                expenseChart = null;

            }


            alert(
                "Income and expense data have been cleared."
            );

        }
    );


    /* ================= LOGOUT ================= */

    logoutButton.addEventListener(
        "click",
        function () {


            localStorage.removeItem("currentUser");


            alert("You have been logged out.");


            window.location.href = "index.html";

        }
    );


    /* ================= PIE CHART ================= */

    chartButton.addEventListener(
        "click",
        function () {


            chartContainer.classList.toggle("show");


            if (
                chartContainer.classList.contains("show")
            ) {

                createChart();

            }

        }
    );


    /* ================= SAVE USER ================= */

    function saveUser() {

        localStorage.setItem(
            currentUser,
            JSON.stringify(user)
        );

    }


    /* ================= UPDATE DASHBOARD ================= */

    function updateDashboard() {


        const balance =
            user.income - user.expense;


        balanceElement.textContent =
            balance;


        expenseElement.textContent =
            user.expense;


        displayIncomeTable();

        displayExpenseTable();
        
        if (chartContainer.classList.contains("show")) {
            createChart();
        }

    }


    /* ================= INCOME TABLE ================= */

    function displayIncomeTable() {


        incomeTableBody.innerHTML = "";


        if (user.incomeArray.length === 0) {

            incomeTableBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        No income records
                    </td>
                </tr>
            `;

            return;
        }


        user.incomeArray.forEach(
            function (item) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${item.type}</td>

                    <td>+${item.amount}</td>

                    <td>${item.balance}</td>

                `;


                incomeTableBody.appendChild(row);

            }
        );

    }


    /* ================= EXPENSE TABLE ================= */

    function displayExpenseTable() {


        expenseTableBody.innerHTML = "";


        if (user.expenseArray.length === 0) {

            expenseTableBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        No expense records
                    </td>
                </tr>
            `;

            return;
        }


        user.expenseArray.forEach(
            function (item) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${item.type}</td>

                    <td>-${item.amount}</td>

                    <td>${item.balance}</td>

                `;


                expenseTableBody.appendChild(row);

            }
        );

    }


    /* ================= CREATE CHART ================= */

    function createChart() {

        const canvas =
            document.getElementById("expenseChart");

        const ctx =
            canvas.getContext("2d");

        if (expenseChart) {
            expenseChart.destroy();
        }

        const categoryTotals = {};
        user.expenseArray.forEach(function (item) {
            if (categoryTotals[item.type]) {
                categoryTotals[item.type] += item.amount;
            } else {
                categoryTotals[item.type] = item.amount;
            }
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        const balance = user.income - user.expense;
        const chartBalance = Math.max(balance, 0);

        labels.push("Remaining Balance");
        data.push(chartBalance);

        const backgroundColors = [
            "#f25430", "#ff9800", "#ffc107", "#e91e63", "#9c27b0", 
            "#3f51b5", "#03a9f4", "#8bc34a", "#cddc39", "#795548"
        ];

        const chartColors = [];
        for (let i = 0; i < labels.length - 1; i++) {
            chartColors.push(backgroundColors[i % backgroundColors.length]);
        }
        chartColors.push("#2dbbb6");

        expenseChart =
            new Chart(
                ctx,
                {
                    type: "pie",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: chartColors,
                                borderColor: "#ffffff",
                                borderWidth: 2
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top"
                            },
                            title: {
                                display: false
                            }
                        }
                    }
                }
            );

    }

});