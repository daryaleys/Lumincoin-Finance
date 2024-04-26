import Chart from "chart.js/auto";

export class Main {
  constructor() {
    const incomeData = {
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          label: "Доходы",
          data: [300, 50, 100, 25, 75],
          backgroundColor: [
            "rgb(220, 53, 69)",
            "rgb(253, 126, 20)",
            "rgb(255, 193, 7)",
            "rgb(32, 201, 151)",
            "rgb(13, 119, 253)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    new Chart(document.getElementById("income-pie"), {
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
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          label: "Расходы",
          data: [100, 100, 80, 100, 100],
          backgroundColor: [
            "rgb(220, 53, 69)",
            "rgb(253, 126, 20)",
            "rgb(255, 193, 7)",
            "rgb(32, 201, 151)",
            "rgb(13, 119, 253)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    new Chart(document.getElementById("expenses-pie"), {
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
