import Chart from "chart.js/auto";
import {Requests} from "../helpers/requests";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.commonErrorElement = document.getElementById("common-error");

        this.filterButtons = document.querySelectorAll(".filter-button");
        this.filterButtons.forEach((button) =>
            button.addEventListener("click", this.chooseInterval.bind(this))
        );

        this.dateFromElement = document.getElementById("startDate");
        this.dateToElement = document.getElementById("endDate");

        $("#startDate").datepicker({
            format: "dd.mm.yyyy",
            locale: "ru",
        }).on('changeDate', this.chooseDate.bind(this));
        $("#endDate").datepicker({
            format: "dd.mm.yyyy",
            locale: "ru",
        }).on('changeDate', this.chooseDate.bind(this));

        this.incomeChartElement = document.getElementById("income-pie");
        this.expenseChartElement = document.getElementById("expenses-pie");

        this.getOperations().then();
    }

    chooseInterval(e) {
        this.commonErrorElement.style.display = 'none';

        this.dateFromElement.setAttribute("disabled", "disabled");
        this.dateFromElement.value = "";
        this.dateToElement.setAttribute("disabled", "disabled");
        this.dateToElement.value = "";

        this.filterButtons.forEach((button) => {
            button.classList.add(
                "border",
                "border-secondary",
                "text-secondary",
                "btn-tertiary"
            );
            button.classList.remove("btn-secondary");
        });

        e.target.classList.remove(
            "border",
            "border-secondary",
            "text-secondary",
            "btn-tertiary"
        );
        e.target.classList.add("btn-secondary");

        const filter = e.target.dataset.filter;
        if (filter === "interval") {
            this.dateFromElement.removeAttribute("disabled");
            this.dateToElement.removeAttribute("disabled");
            this.commonErrorElement.innerText = "Выберите даты интервала"
            this.commonErrorElement.style.display = 'block';
        }

        if (filter !== "interval") this.getOperations(filter).then();
    }

    chooseDate() {
        this.commonErrorElement.style.display = "none";

        if (!this.dateToElement.value || !this.dateFromElement.value) {
            this.commonErrorElement.innerText = "Выберите обе даты интервала";
            return this.commonErrorElement.style.display = "block";
        }

        const dateFrom = this.dateFromElement.value.split(".").reverse().join("-");
        const dateTo = this.dateToElement.value.split(".").reverse().join("-");

        if (new Date(dateFrom) > new Date(dateTo)) {
            this.commonErrorElement.innerText = "Дата начала должна быть меньше даты окончания"
            return this.commonErrorElement.style.display = "block";
        }

        this.getOperations("interval", dateFrom, dateTo).then();
    }

    async getOperations(period = "today", dateFrom = null, dateTo = null) {
        let url = "/operations?period=" + period;
        if (dateFrom && dateTo) {
            url = url + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo;
        }

        const result = await Requests.request(url, "GET", true);

        if (result.redirect) {
            this.openNewRoute(result.redirect);
        }

        if (result.error) {
            return alert(
                "Возникла ошибка при запросе операций. Пожалуйста, обратитесь в поддержку"
            );
        }

        this.createData(result);
    }

    createData(operations) {
        const incomeOperations = operations.filter(operation => operation.type === "income");
        const expenseOperations = operations.filter(operation => operation.type === "expense");

        const incomeAmounts = {}, expenseAmounts = {};

        incomeOperations.forEach(operation => {
            incomeAmounts[operation.category] = (incomeAmounts[operation.category] || 0) + operation.amount;
        })
        expenseOperations.forEach(operation => {
            expenseAmounts[operation.category] = (expenseAmounts[operation.category] || 0) + operation.amount;
        })

        this.createCharts(incomeAmounts, expenseAmounts);
    }

    createCharts(incomeAmounts, expenseAmounts) {
        const incomeData = {
            labels: Object.keys(incomeAmounts),
            datasets: [
                {
                    label: "Доходы",
                    data: Object.keys(incomeAmounts).map(category => incomeAmounts[category]),
                },
            ],
        };

        if (this.incomeChart) this.incomeChart.destroy();
        this.incomeChart = new Chart(this.incomeChartElement, {
            type: "pie",
            data: incomeData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        });

        const expenseData = {
            labels: Object.keys(expenseAmounts),
            datasets: [
                {
                    label: "Расходы",
                    data: Object.keys(expenseAmounts).map(category => expenseAmounts[category]),
                },
            ],
        };

        if (this.expenseChart) this.expenseChart.destroy();
        this.expenseChart = new Chart(this.expenseChartElement, {
            type: "pie",
            data: expenseData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        });
    }
}
