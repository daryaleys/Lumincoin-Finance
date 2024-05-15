import { Requests } from "../../helpers/requests.ts";
import { CategoryType } from "../../types/categories.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class OperationAdd {
	private openNewRoute: OpenNewRouteType;

	private operationTypeElement: HTMLInputElement | null = document.getElementById("operation-type") as HTMLInputElement | null;
	private operationCategoryElement: HTMLInputElement | null = document.getElementById("operation-category") as HTMLInputElement | null;
	private operationAmountElement: HTMLInputElement | null = document.getElementById("operation-amount") as HTMLInputElement | null;
	private operationDateElement: HTMLInputElement | null = document.getElementById("operation-date") as HTMLInputElement | null;
	private operationCommentElement: HTMLInputElement | null = document.getElementById("operation-comment") as HTMLInputElement | null;
	private commonErrorElement: HTMLElement | null = document.getElementById("common-error");

	constructor(openNewRoute) {
		this.openNewRoute = openNewRoute;

		if (this.operationTypeElement) {
			this.operationTypeElement.addEventListener("change", this.getCategories.bind(this));
		}

		const createOperationButton: HTMLElement | null = document.getElementById("create-operation-button");
		if (createOperationButton) {
			createOperationButton.addEventListener("click", this.createOperation.bind(this));
		}

		$("#operation-date").datepicker({
			format: "dd.mm.yyyy",
			language: "ru",
		});
	}

	private async getCategories(e: Event): Promise<void> {
		const targetElement: HTMLInputElement | null = e.target as HTMLInputElement | null;

		if (targetElement) {
			const operationType = targetElement.value;
			if (!operationType) return;

			const result: CommonResultType | CategoryType[] = await Requests.request("/categories/" + operationType, "GET", true);

			if ((result as CommonResultType).redirect) {
				this.openNewRoute((result as CommonResultType).redirect as string);
			}

			if ((result as CommonResultType).error) {
				alert("Возникла ошибка при запросе категорий. Пожалуйста, обратитесь в поддержку");
				return;
			}

			this.addCategoriesToSelect(result as CategoryType[]);
		}
	}

	private addCategoriesToSelect(categories: CategoryType[]): void {
		const currentOptions: NodeListOf<HTMLElement> | undefined = this.operationCategoryElement?.querySelectorAll("option");

		if (currentOptions) {
			for (let i = 1; i < currentOptions.length; i++) {
				currentOptions[i].remove();
			}
		}

		if (this.operationCategoryElement) {
			categories.forEach((category) => {
				const optionElement: HTMLOptionElement | null = document.createElement("option");
				optionElement.value = category.id.toString();
				optionElement.innerText = category.title;
				this.operationCategoryElement?.appendChild(optionElement);
			});
		}
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

	private async createOperation(): Promise<void> {
		if (this.commonErrorElement) {
			this.commonErrorElement.style.display = "none";
		}

		if (!this.operationAmountElement || !this.operationCategoryElement || !this.operationCommentElement || !this.operationDateElement || !this.operationTypeElement) {
			alert("Не удалось создать операцию. Обратитесь в поддержку");
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

			const result: CommonResultType = await Requests.request("/operations", "POST", true, JSON.stringify(body));

			if (result.redirect) {
				this.openNewRoute(result.redirect);
			}

			if (result.error) {
				if (result.message === "This record already exists" && this.commonErrorElement) {
					this.commonErrorElement.style.display = "block";
					this.commonErrorElement.innerText = "Такая операция уже существует";
					return;
				}

				alert("Возникла ошибка при создании операции. Пожалуйста, обратитесь в поддержку");
				return;
			}

			this.openNewRoute("/income-and-expenses");
		}
	}
}
