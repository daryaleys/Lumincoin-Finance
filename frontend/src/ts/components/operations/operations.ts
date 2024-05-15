import { Requests } from "../../helpers/requests.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { OperationType } from "../../types/operations.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class Operations {
	private openNewRoute: OpenNewRouteType;
	readonly commonErrorElement: HTMLElement | null = document.getElementById("common-error");
	readonly filterButtons: NodeListOf<Element> = document.querySelectorAll(".filter-button");
	readonly dateFromElement: HTMLInputElement | null = document.getElementById("startDate") as HTMLInputElement | null;
	readonly dateToElement: HTMLInputElement | null = document.getElementById("endDate") as HTMLInputElement | null;
	readonly tableElement: HTMLElement | null = document.getElementById("tbody");
	readonly deleteOperationButton: HTMLElement | null = document.getElementById("delete-operation-button");

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

		const result: CommonResultType | OperationType[] = await Requests.request(url, "GET", true);

		if ((result as CommonResultType).redirect) {
			this.openNewRoute((result as CommonResultType).redirect as string);
		}

		if ((result as CommonResultType).error) {
			alert("Возникла ошибка при запросе операций. Пожалуйста, обратитесь в поддержку");
			return;
		}

		this.showOperations(result as OperationType[]);
	}

	private showOperations(operations: OperationType[]): void {
		if (!this.tableElement) return;

		this.tableElement.querySelectorAll("tr").forEach((tr) => tr.remove());

		operations.forEach((operation: OperationType, index: number) => {
			const trElement: HTMLElement | null = document.createElement("tr");
			trElement.setAttribute("data-operation", operation.id.toString());

			const tdNumberElement: HTMLElement | null = document.createElement("th");
			tdNumberElement.classList.add("text-center");
			tdNumberElement.innerText = (index + 1).toString();

			const tdOperationType: HTMLElement | null = document.createElement("td");
			tdOperationType.classList.add("text-center");
			if (operation.type === "income") {
				tdOperationType.innerText = "доход";
				tdOperationType.classList.add("text-success");
			} else {
				tdOperationType.innerText = "расход";
				tdOperationType.classList.add("text-danger");
			}

			const tdOperationCategory: HTMLElement | null = document.createElement("td");
			tdOperationCategory.classList.add("text-center");
			tdOperationCategory.innerText = operation.category;

			const tdAmountElement: HTMLElement | null = document.createElement("td");
			tdAmountElement.classList.add("text-center");
			tdAmountElement.innerText = operation.amount + "$";

			const tdDateElement: HTMLElement | null = document.createElement("td");
			tdDateElement.classList.add("text-center");
			tdDateElement.innerText = operation.date.split("-").reverse().join(".");

			const tdCommentElement: HTMLElement | null = document.createElement("td");
			tdCommentElement.classList.add("text-center");
			tdCommentElement.innerText = operation.comment;

			const tdActionsElement: HTMLElement | null = document.createElement("td");
			tdActionsElement.classList.add("d-flex", "gap-2", "justify-content-end");

			const deleteIconElement: HTMLElement | null = document.createElement("div");
			deleteIconElement.classList.add("delete-action");
			deleteIconElement.setAttribute("data-bs-toggle", "modal");
			deleteIconElement.setAttribute("data-bs-target", "#modal");
			deleteIconElement.setAttribute("role", "button");

			const deleteIconImage: HTMLElement | null = document.createElement("img");
			deleteIconImage.setAttribute("src", "../../../assets/delete-action.svg");
			deleteIconImage.addEventListener("click", this.deleteOperation.bind(this));

			deleteIconElement.appendChild(deleteIconImage);

			const editIconElement: HTMLElement | null = document.createElement("a");
			editIconElement.setAttribute("href", "/income-expense-edit?operation=" + operation.id);
			editIconElement.classList.add("edit-action", "text-black");

			const editIconImage: HTMLElement | null = document.createElement("img");
			editIconImage.setAttribute("src", "../../../assets/edit-action.svg");

			editIconElement.appendChild(editIconImage);

			tdActionsElement.appendChild(deleteIconElement);
			tdActionsElement.appendChild(editIconElement);

			trElement.appendChild(tdNumberElement);
			trElement.appendChild(tdOperationType);
			trElement.appendChild(tdOperationCategory);
			trElement.appendChild(tdAmountElement);
			trElement.appendChild(tdDateElement);
			trElement.appendChild(tdCommentElement);
			trElement.appendChild(tdActionsElement);

			this.tableElement?.appendChild(trElement);
		});
	}

	private deleteOperation(e: Event): void {
		let operationId: number = -1;
		const targetElement: HTMLElement | null = e.target as HTMLElement | null;
		const trElement: HTMLElement | null = targetElement?.parentElement?.parentElement?.parentElement as HTMLElement | null;

		if (trElement) {
			if (trElement.dataset.operation) {
				operationId = +trElement.dataset.operation;
			}

			if (this.deleteOperationButton) {
				this.deleteOperationButton.onclick = async (): Promise<void> => {
					const result: CommonResultType = await Requests.request("/operations/" + operationId, "DELETE", true);

					if (result.error) {
						alert("Возникла ошибка при удалении операции. Пожалуйста, обратитесь в поддержку");
						return;
					}

					trElement.remove();

					if (this.tableElement) {
						this.tableElement.querySelectorAll("th").forEach((th, index) => (th.innerText = (index + 1).toString()));
					}
				};
			}
		}
	}
}
