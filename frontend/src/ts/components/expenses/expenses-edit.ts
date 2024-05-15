import { Requests } from "../../helpers/requests.ts";
import { CategoryType } from "../../types/categories.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class ExpensesEdit {
	private openNewRoute: OpenNewRouteType;
	private categoryTitleElement: HTMLInputElement | null = document.getElementById("category-title") as HTMLInputElement | null;
	private currentCategory: CategoryType | null = null;

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		const expensesEditButton: HTMLElement | null = document.getElementById("expense-edit-submit");
		if (expensesEditButton) {
			expensesEditButton.addEventListener("click", this.editCategory.bind(this));
		}

		const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
		const categoryId = queryParams.get("category");
		if (!categoryId) {
			this.openNewRoute("/expenses");
			return;
		}

		this.getCategory(+categoryId);
	}

	private async getCategory(categoryId: number): Promise<void> {
		const result: CommonResultType | CategoryType = await Requests.request("/categories/expense/" + categoryId, "GET", true);

		if ((result as CommonResultType).redirect) {
			this.openNewRoute((result as CommonResultType).redirect as string);
		}

		if ((result as CommonResultType).error) {
			alert("Возникла ошибка при запросе категории. Пожалуйста, обратитесь в поддержку");
			return;
		}

		if (this.categoryTitleElement) {
			this.categoryTitleElement.value = (result as CategoryType).title;
			this.currentCategory = result as CategoryType;
		}
	}

	private async editCategory(): Promise<void> {
		if (this.categoryTitleElement && this.currentCategory) {
			this.categoryTitleElement.classList.remove("is-invalid");
			if (!this.categoryTitleElement.value || this.categoryTitleElement.value === this.currentCategory.title) {
				this.categoryTitleElement.classList.add("is-invalid");
				return;
			}

			const body = { title: this.categoryTitleElement.value };

			const result: CommonResultType = await Requests.request("/categories/expense/" + this.currentCategory.id, "PUT", true, JSON.stringify(body));

			if (result.redirect) {
				this.openNewRoute(result.redirect);
			}

			if (result.error) {
				return alert("Возникла ошибка при редактировании категории. Пожалуйста, обратитесь в поддержку");
			}

			this.openNewRoute("/expenses");
		}
	}
}
