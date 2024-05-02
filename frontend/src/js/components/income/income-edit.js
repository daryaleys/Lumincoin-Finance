export class IncomeEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    document
      .getElementById("income-edit-submit")
      .addEventListener("click", this.editCategory.bind(this));

    this.categoryTitleElement = document.getElementById("category-title");

    // const categoryId = window.URLSearchParams()
    // this.getCategory(categoryId);
  }

  async getCategory(categoryId) {
    const result = await Requests.getCategory(categoryId);
    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе категорий. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.showCategories(result);
  }

  editCategory() {}
}
