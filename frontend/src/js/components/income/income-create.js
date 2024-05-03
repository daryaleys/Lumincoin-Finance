import { Requests } from "../../helpers/requests";

export class IncomeCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    document
      .getElementById("income-create-submit")
      .addEventListener("click", this.createCategory.bind(this));

    this.categoryTitleElement = document.getElementById("category-title");
  }

  async createCategory() {
    this.categoryTitleElement.classList.remove("is-invalid");

    if (!this.categoryTitleElement.value) {
      this.categoryTitleElement.classList.add("is-invalid");
      return;
    }

    const body = {
      title: this.categoryTitleElement.value,
    };

    const result = await Requests.request(
      "/categories/income",
      "POST",
      true,
      body
    );

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error || !result.id || !result.title) {
      return alert(
        "Возникла ошибка при добавлении категории. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.openNewRoute("/income");
  }
}
