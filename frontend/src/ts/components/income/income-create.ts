import { Requests } from "../../helpers/requests.ts";
import { CategoryType } from "../../types/categories.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class IncomeCreate {
	private openNewRoute: OpenNewRouteType;
	private categoryTitleElement: HTMLInputElement | null = document.getElementById("category-title") as HTMLInputElement | null;

	constructor(openNewRoute) {
		this.openNewRoute = openNewRoute;

		const incomeCreateButton: HTMLElement | null = document.getElementById("income-create-submit");
		if (incomeCreateButton) {
			incomeCreateButton.addEventListener("click", this.createCategory.bind(this));
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

			const result: CommonResultType | CategoryType = await Requests.request("/categories/income", "POST", true, JSON.stringify(body));

			if ((result as CommonResultType).redirect) {
				this.openNewRoute((result as CommonResultType).redirect as string);
			}

			if ((result as CommonResultType).error || !(result as CategoryType).id || !(result as CategoryType).title) {
				alert("Возникла ошибка при добавлении категории. Пожалуйста, обратитесь в поддержку");
				return;
			}

			this.openNewRoute("/income");
		}
	}
}
