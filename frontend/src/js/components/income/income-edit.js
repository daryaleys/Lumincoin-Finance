import { Requests } from "../../helpers/requests";

export class IncomeEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.currentCategory = {};
    this.categoryTitleElement = document.getElementById("category-title");

    document
      .getElementById("income-edit-submit")
      .addEventListener("click", this.editCategory.bind(this));

    let url = new URL(window.location);
    const categoryId = url.searchParams.get("category");
    if (!categoryId) {
      return this.openNewRoute("/income");
    }

    this.getCategory(categoryId);
  }

  async getCategory(categoryId) {
    const result = await Requests.getCategory(categoryId);
    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе категории. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.categoryTitleElement.value = result.title;
    this.currentCategory = result;
  }

  async editCategory() {
    this.categoryTitleElement.classList.remove("is-invalid");
    if (
      !this.categoryTitleElement.value ||
      this.categoryTitleElement.value === this.currentCategory.title
    ) {
      this.categoryTitleElement.classList.add("is-invalid");
      return;
    }

    const body = { title: this.categoryTitleElement.value };

    const result = await Requests.editCategory(body, this.currentCategory.id);

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при редактировании категории. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.openNewRoute("/income");
  }
}
