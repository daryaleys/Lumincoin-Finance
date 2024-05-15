import { Requests } from "../../helpers/requests.ts";
import { CategoryType } from "../../types/categories.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class Income {
	private openNewRoute: OpenNewRouteType;
	private categoryCardsList: HTMLElement | null = document.getElementById("category-cards-list");
	private deleteCategoryButton: HTMLElement | null = document.getElementById("delete-category-button");
	private appendCategoryButton: HTMLElement | null = document.getElementById("append-category-button");

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;
		this.getCategories().then();
	}

	private async getCategories(): Promise<void> {
		const result: CommonResultType | CategoryType[] = await Requests.request("/categories/income", "GET", true);

		if ((result as CommonResultType).redirect) {
			this.openNewRoute((result as CommonResultType).redirect as string);
		}

		if ((result as CommonResultType).error) {
			alert("Возникла ошибка при запросе категорий. Пожалуйста, обратитесь в поддержку");
			return;
		}

		this.showCategories(result as CategoryType[]);
	}

	private showCategories(categories: CategoryType[]): void {
		categories.forEach((category: CategoryType) => this.createCategoryCard(category.id, category.title));
	}

	private createCategoryCard(id: number, title: string): void {
		const category: HTMLElement | null = document.createElement("div");
		const categoryCard: HTMLElement | null = document.createElement("div");
		const categoryCardBody: HTMLElement | null = document.createElement("div");

		category.classList.add("col");
		categoryCard.classList.add("card", "mb-4", "rounded-4", "border", "border-2");
		categoryCardBody.classList.add("card-body");
		categoryCardBody.setAttribute("data-category", id.toString());

		category.appendChild(categoryCard);
		categoryCard.appendChild(categoryCardBody);

		const categoryTitle: HTMLElement | null = document.createElement("h5");
		categoryTitle.classList.add("card-title", "fw-medium", "text-primary-emphasis", "fs-3", "mb-3");
		categoryTitle.innerText = title;

		const categoryEditLink: HTMLElement | null = document.createElement("a");
		categoryEditLink.classList.add("btn", "btn-primary", "d-inline-flex", "align-items-center", "py-2", "px-3");
		categoryEditLink.innerText = "Редактировать";
		categoryEditLink.setAttribute("href", `/income-edit?category=${id}`);

		const categoryDeleteButton: HTMLElement | null = document.createElement("button");
		categoryDeleteButton.classList.add("btn", "btn-danger", "d-inline-flex", "align-items-center", "py-2", "px-3", "ms-2", "card-delete-category");
		categoryDeleteButton.setAttribute("type", "button");
		categoryDeleteButton.setAttribute("data-bs-toggle", "modal");
		categoryDeleteButton.setAttribute("data-bs-target", "#modal");
		categoryDeleteButton.addEventListener("click", this.deleteCategory.bind(this));
		categoryDeleteButton.innerText = "Удалить";

		categoryCardBody.appendChild(categoryTitle);
		categoryCardBody.appendChild(categoryEditLink);
		categoryCardBody.appendChild(categoryDeleteButton);

		this.categoryCardsList?.insertBefore(category, this.appendCategoryButton);
	}

	private deleteCategory(e: Event): void {
		let categoryId: number = -1;
		const targetElement: HTMLElement | null = e.target as HTMLElement | null;
		if (targetElement) {
			const cardElement = targetElement.parentElement;
			if (cardElement && cardElement.dataset.category) {
				categoryId = +cardElement.dataset.category;
			}

			if (this.deleteCategoryButton) {
				this.deleteCategoryButton.onclick = async (): Promise<void> => {
					const result: CommonResultType = await Requests.request("/categories/income/" + categoryId, "DELETE", true);

					if (result.error) {
						alert("Возникла ошибка при удалении категории. Пожалуйста, обратитесь в поддержку");
						return;
					}

					cardElement?.parentElement?.parentElement?.remove();
				};
			}
		}
	}
}
