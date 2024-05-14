import { Requests } from "../../helpers/requests";

export class ExpensesEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.currentCategory = {};
    this.categoryTitleElement = document.getElementById("category-title");

    document
      .getElementById("expense-edit-submit")
      .addEventListener("click", this.editCategory.bind(this));

    let url = new URL(window.location);
    const categoryId = url.searchParams.get("category");
    if (!categoryId) {
      return this.openNewRoute("/expenses");
    }

    this.getCategory(categoryId);
  }

  async getCategory(categoryId) {
    const result = await Requests.request(
      "/categories/expense/" + categoryId,
      "GET",
      true
    );

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

    const result = await Requests.request(
      "/categories/expense/" + this.currentCategory.id,
      "PUT",
      true,
      body
    );

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при редактировании категории. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.openNewRoute("/expenses");
  }
}
