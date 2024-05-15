import { Requests } from "../../helpers/requests.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";

export class ExpensesCreate {
	private openNewRoute: OpenNewRouteType;
	private categoryTitleElement: HTMLInputElement | null = document.getElementById("category-title") as HTMLInputElement | null;

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		const expensesCreateButton: HTMLElement | null = document.getElementById("expense-create-submit");
		if (expensesCreateButton) {
			expensesCreateButton.addEventListener("click", this.createCategory.bind(this));
		}
	}

	private async createCategory(): Promise<void> {
		if (this.categoryTitleElement) {
			this.categoryTitleElement.classList.remove("is-invalid");

			if (!this.categoryTitleElement.value) {
				this.categoryTitleElement.classList.add("is-invalid");
				return;
			}

			const body = {
				title: this.categoryTitleElement.value,
			};

			const result = await Requests.request("/categories/expense", "POST", true, JSON.stringify(body));

			if (result.redirect) {
				this.openNewRoute(result.redirect);
			}

			if (result.error || !result.id || !result.title) {
				alert("Возникла ошибка при добавлении категории. Пожалуйста, обратитесь в поддержку");
				return;
			}

			this.openNewRoute("/expenses");
		}
	}
}
