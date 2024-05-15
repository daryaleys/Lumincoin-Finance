import { Requests } from "../../helpers/requests.ts";
import { CategoryType } from "../../types/categories.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { OperationType } from "../../types/operations.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class OperationEdit {
	private openNewRoute: OpenNewRouteType;

	private operationTypeElement: HTMLInputElement | null = document.getElementById("operation-type") as HTMLInputElement | null;
	private operationCategoryElement: HTMLInputElement | null = document.getElementById("operation-category") as HTMLInputElement | null;
	private operationAmountElement: HTMLInputElement | null = document.getElementById("operation-amount") as HTMLInputElement | null;
	private operationDateElement: HTMLInputElement | null = document.getElementById("operation-date") as HTMLInputElement | null;
	private operationCommentElement: HTMLInputElement | null = document.getElementById("operation-comment") as HTMLInputElement | null;

	private incomeCategories: CategoryType[];
	private expenseCategories: CategoryType[];

	private operationId: number;
	private currentOperation: OperationType;

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		$("#operation-date").datepicker({
			format: "dd.mm.yyyy",
			language: "ru",
		});

		if (this.operationTypeElement) {
			this.operationTypeElement.addEventListener("change", (e: Event) => {
				const targetElement: HTMLInputElement | null = e.target as HTMLInputElement | null;
				if (targetElement) {
					if (targetElement.value === "income") {
						this.addCategoriesToSelect(this.incomeCategories);
					} else {
						this.addCategoriesToSelect(this.expenseCategories);
					}
				}
			});
		}

		const editOperationButton: HTMLElement | null = document.getElementById("edit-operation-button") as HTMLElement | null;
		if (editOperationButton) {
			editOperationButton.addEventListener("click", this.editOperation.bind(this));
		}

		const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
		const operationId = queryParams.get("operation");
		if (!operationId) {
			this.openNewRoute("/income-and-expenses");
			return;
		}
		this.operationId = +operationId;

		this.getInfo().then();
	}

	private async getInfo(): Promise<void> {
		this.incomeCategories = (await this.getCategories("income")) as CategoryType[];
		this.expenseCategories = (await this.getCategories("expense")) as CategoryType[];
		this.currentOperation = await this.getOperation(this.operationId).then();
		this.showInfo();
	}

	private async getCategories(operationType: string): Promise<void | CategoryType[]> {
		const result: CommonResultType | CategoryType[] = await Requests.request("/categories/" + operationType, "GET", true);

		if ((result as CommonResultType).redirect) {
			this.openNewRoute((result as CommonResultType).redirect as string);
		}

		if ((result as CommonResultType).error) {
			alert("Возникла ошибка при запросе категорий. Пожалуйста, обратитесь в поддержку");
			return;
		}

		return result as CategoryType[];
	}

	private async getOperation(operationId: number): Promise<void | OperationType> {
		const result: CommonResultType | OperationType = await Requests.request("/operations/" + operationId, "GET", true);

		if ((result as CommonResultType).redirect) {
			this.openNewRoute((result as CommonResultType).redirect as string);
		}

		if ((result as CommonResultType).error) {
			alert("Возникла ошибка при запросе операции. Пожалуйста, обратитесь в поддержку");
			return;
		}

		return result as OperationType;
	}

	private showInfo(): void {
		let currentCategoryId: number | undefined = 0;

		if (this.currentOperation.type === "income") {
			this.addCategoriesToSelect(this.incomeCategories);
			currentCategoryId = this.incomeCategories.find((category) => category.title === this.currentOperation.category)?.id;
		} else {
			this.addCategoriesToSelect(this.expenseCategories);
			currentCategoryId = this.expenseCategories.find((category) => category.title === this.currentOperation.category)?.id;
		}

		if (!currentCategoryId || !this.operationAmountElement || !this.operationCategoryElement || !this.operationCommentElement || !this.operationDateElement || !this.operationTypeElement) return;

		this.operationTypeElement.value = this.currentOperation.type;
		this.operationCategoryElement.value = currentCategoryId.toString();
		this.operationAmountElement.value = this.currentOperation.amount.toString();
		this.operationDateElement.value = this.currentOperation.date.split("-").reverse().join(".");
		this.operationCommentElement.value = this.currentOperation.comment;
	}

	private addCategoriesToSelect(categories: CategoryType[]): void {
		this.operationCategoryElement?.querySelectorAll("option").forEach((option) => option.remove());

		categories.forEach((category: CategoryType) => {
			const optionElement: HTMLOptionElement | null = document.createElement("option");
			optionElement.value = category.id.toString();
			optionElement.innerText = category.title;
			this.operationCategoryElement?.appendChild(optionElement);
		});
	}

	private validateForm(): boolean {
		let isValid = true;

		if (this.operationTypeElement) {
			if (!this.operationTypeElement.value) {
				this.operationTypeElement.classList.add("is-invalid");
				isValid = false;
			} else {
				this.operationTypeElement.classList.remove("is-invalid");
			}
		}

		if (this.operationCategoryElement) {
			if (!this.operationCategoryElement.value) {
				this.operationCategoryElement.classList.add("is-invalid");
				isValid = false;
			} else {
				this.operationCategoryElement.classList.remove("is-invalid");
			}
		}

		if (this.operationAmountElement) {
			if (!this.operationAmountElement.value || +this.operationAmountElement.value < 0) {
				this.operationAmountElement.classList.add("is-invalid");
				isValid = false;
			} else {
				this.operationAmountElement.classList.remove("is-invalid");
			}
		}

		if (this.operationDateElement) {
			if (!this.operationDateElement.value) {
				this.operationDateElement.classList.add("is-invalid");
				isValid = false;
			} else {
				this.operationDateElement.classList.remove("is-invalid");
			}
		}

		if (this.operationCommentElement) {
			if (!this.operationCommentElement.value) {
				this.operationCommentElement.classList.add("is-invalid");
				isValid = false;
			} else {
				this.operationCommentElement.classList.remove("is-invalid");
			}
		}

		return isValid;
	}

	private async editOperation(): Promise<void> {
		if (!this.operationAmountElement || !this.operationCategoryElement || !this.operationCommentElement || !this.operationDateElement || !this.operationTypeElement) {
			alert("Не удалось отредактировать операцию. Обратитесь в поддержку");
			return;
		}

		if (this.validateForm()) {
			const body = {
				type: this.operationTypeElement.value,
				amount: this.operationAmountElement.value,
				date: this.operationDateElement.value.split(".").reverse().join("-"),
				comment: this.operationCommentElement.value,
				category_id: +this.operationCategoryElement.value,
			};

			const result: CommonResultType = await Requests.request("/operations/" + this.operationId, "PUT", true, JSON.stringify(body));

			if (result.redirect) {
				this.openNewRoute(result.redirect);
			}

			if (result.error) {
				return alert("Возникла ошибка при редактировании операции. Пожалуйста, обратитесь в поддержку");
			}

			this.openNewRoute("/income-and-expenses");
		}
	}
}
