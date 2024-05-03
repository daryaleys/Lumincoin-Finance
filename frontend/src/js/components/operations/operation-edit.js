import { Requests } from "../../helpers/requests";

export class OperationEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.operationTypeElement = document.getElementById("operation-type");
    this.operationCategoryElement =
      document.getElementById("operation-category");
    this.operationAmountElement = document.getElementById("operation-amount");
    this.operationDateElement = document.getElementById("operation-date");
    this.operationCommentElement = document.getElementById("operation-comment");

    // this.operationTypeElement.addEventListener(
    //   "change",
    //   this.getCategories().bind(this)
    // );

    let url = new URL(window.location);
    const operationId = url.searchParams.get("operation");
    if (!operationId) {
      return this.openNewRoute("/income-and-expenses");
    }

    this.getOperation(operationId);

    document
      .getElementById("edit-operation-button")
      .addEventListener("click", this.editOperation.bind(this));

    $("#operation-date").datepicker({
      format: "dd.mm.yyyy",
      locale: "ru",
    });
  }

  async getOperation(operationId) {
    const result = await Requests.request(
      "/operations/" + operationId,
      "GET",
      true
    );

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе операции. Пожалуйста, обратитесь в поддержку"
      );
    }

    // this.getCategories();

    this.operationTypeElement.value = result.type;
    // this.operationCategoryElement.value = result.category;
    this.operationAmountElement.value = result.amount;
    this.operationDateElement.value = result.date
      .split("-")
      .reverse()
      .join(".");
    this.operationCommentElement.value = result.comment;

    console.log(result);
  }

  async getCategories() {
    const operationType = e.target.value;

    const result = await Requests.request(
      "/categories/" + operationType,
      "GET",
      true
    );

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе категорий. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.addCategoriesToSelect(result);
  }

  addCategoriesToSelect(categories) {
    const currentOptions =
      this.operationCategoryElement.querySelectorAll("option");
    for (let i = 1; i < currentOptions.length; i++) {
      currentOptions[i].remove();
    }

    categories.forEach((category) => {
      const optionElement = document.createElement("option");
      optionElement.value = category.id;
      optionElement.innerText = category.title;
      this.operationCategoryElement.appendChild(optionElement);
    });
  }

  editOperation() {}
}
