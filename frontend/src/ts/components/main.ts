import Chart, { ChartItem } from "chart.js/auto";
import { Requests } from "../helpers/requests.ts";
import { OpenNewRouteType } from "../types/open-route.type.ts";
import { OperationChartDataType, OperationsByCategoriesType, OperationType } from "../types/operations.type.ts";

export class Main {
	private openNewRoute: OpenNewRouteType;
	readonly commonErrorElement: HTMLElement | null = document.getElementById("common-error");
	readonly filterButtons: NodeListOf<Element> = document.querySelectorAll(".filter-button");
	readonly dateFromElement: HTMLInputElement | null = document.getElementById("startDate") as HTMLInputElement | null;
	readonly dateToElement: HTMLInputElement | null = document.getElementById("endDate") as HTMLInputElement | null;
	readonly incomeChartElement: HTMLElement | null = document.getElementById("income-pie");
	readonly expenseChartElement: HTMLElement | null = document.getElementById("expenses-pie");

	private incomeChart: any = null; // пыталась использовать тип Chart, но с ним ничего не работает
	private expenseChart: any = null;

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;
		this.filterButtons.forEach((button) => button.addEventListener("click", this.chooseInterval.bind(this)));

		$("#startDate")
			.datepicker({
				format: "dd.mm.yyyy",
				language: "ru",
			})
			.on("changeDate", this.chooseDate.bind(this));
		$("#endDate")
			.datepicker({
				format: "dd.mm.yyyy",
				language: "ru",
			})
			.on("changeDate", this.chooseDate.bind(this));

		this.getOperations().then();
	}

	private chooseInterval(e: Event): void {
		if (this.commonErrorElement) {
			this.commonErrorElement.style.display = "none";
		}

		if (this.dateFromElement && this.dateToElement) {
			this.dateFromElement.setAttribute("disabled", "disabled");
			this.dateFromElement.value = "";
			this.dateToElement.setAttribute("disabled", "disabled");
			this.dateToElement.value = "";
		}

		this.filterButtons.forEach((button) => {
			button.classList.add("border", "border-secondary", "text-secondary", "btn-tertiary");
			button.classList.remove("btn-secondary");
		});

		const targetElement: HTMLElement | null = e.target as HTMLElement | null;
		if (targetElement) {
			targetElement.classList.remove("border", "border-secondary", "text-secondary", "btn-tertiary");
			targetElement.classList.add("btn-secondary");

			const filter = targetElement.dataset.filter;
			if (filter === "interval" && this.dateFromElement && this.dateToElement && this.commonErrorElement) {
				this.dateFromElement.removeAttribute("disabled");
				this.dateToElement.removeAttribute("disabled");
				this.commonErrorElement.innerText = "Выберите даты интервала";
				this.commonErrorElement.style.display = "block";
			}

			if (filter !== "interval") this.getOperations(filter).then();
		}
	}

	private chooseDate(): void {
		if (!this.commonErrorElement || !this.dateFromElement || !this.dateToElement) return;

		this.commonErrorElement.style.display = "none";

		if (!this.dateToElement.value || !this.dateFromElement.value) {
			this.commonErrorElement.innerText = "Выберите обе даты интервала";
			this.commonErrorElement.style.display = "block";
			return;
		}

		const dateFrom = this.dateFromElement.value.split(".").reverse().join("-");
		const dateTo = this.dateToElement.value.split(".").reverse().join("-");

		if (new Date(dateFrom) > new Date(dateTo)) {
			this.commonErrorElement.innerText = "Дата начала должна быть меньше даты окончания";
			this.commonErrorElement.style.display = "block";
			return;
		}

		this.getOperations("interval", dateFrom, dateTo).then();
	}

	private async getOperations(period: string = "today", dateFrom: string | null = null, dateTo: string | null = null): Promise<void> {
		let url: string = "/operations?period=" + period;
		if (dateFrom && dateTo) {
			url = url + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo;
		}

		const result = await Requests.request(url, "GET", true);

		if (result.redirect) {
			this.openNewRoute(result.redirect);
		}

		if (result.error) {
			alert("Возникла ошибка при запросе операций. Пожалуйста, обратитесь в поддержку");
			return;
		}

		this.createData(result);
	}

	private createData(operations: OperationType[]): void {
		const incomeOperations: OperationType[] = operations.filter((operation: OperationType) => operation.type === "income");
		const expenseOperations: OperationType[] = operations.filter((operation: OperationType) => operation.type === "expense");

		const incomeAmounts: OperationsByCategoriesType = {},
			expenseAmounts: OperationsByCategoriesType = {};

		incomeOperations.forEach((operation: OperationType) => {
			incomeAmounts[operation.category] = (incomeAmounts[operation.category] || 0) + operation.amount;
		});
		expenseOperations.forEach((operation: OperationType) => {
			expenseAmounts[operation.category] = (expenseAmounts[operation.category] || 0) + operation.amount;
		});

		this.createCharts(incomeAmounts, expenseAmounts);
	}

	private createCharts(incomeAmounts: OperationsByCategoriesType, expenseAmounts: OperationsByCategoriesType): void {
		const incomeData: OperationChartDataType = {
			labels: Object.keys(incomeAmounts),
			datasets: [
				{
					label: "Доходы",
					data: Object.keys(incomeAmounts).map((category) => incomeAmounts[category]),
				},
			],
		};

		if (this.incomeChart) this.incomeChart.destroy();
		this.incomeChart = new Chart(this.incomeChartElement as ChartItem, {
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
					data: Object.keys(expenseAmounts).map((category) => expenseAmounts[category]),
				},
			],
		};

		if (this.expenseChart) this.expenseChart.destroy();
		this.expenseChart = new Chart(this.expenseChartElement as ChartItem, {
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
