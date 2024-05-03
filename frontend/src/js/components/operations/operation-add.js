import { Requests } from "../../helpers/requests";

export class OperationAdd {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.operationTypeElement = document.getElementById("operation-type");
    this.operationCategoryElement =
      document.getElementById("operation-category");
    this.operationAmountElement = document.getElementById("operation-amount");
    this.operationDateElement = document.getElementById("operation-date");
    this.operationCommentElement = document.getElementById("operation-comment");

    document
      .getElementById("create-operation-button")
      .addEventListener("click", this.createOperation.bind(this));

    $("#operation-date").datepicker({
      format: "dd.mm.yyyy",
      locale: "ru",
    });

    this.operationTypeElement.addEventListener(
      "change",
      this.getCategories.bind(this)
    );
  }

  async getCategories(e) {
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

  async createOperation() {
    if (!this.operationTypeElement.value) {
      this.operationTypeElement.classList.add("is-invalid");
    } else {
      this.operationTypeElement.classList.remove("is-invalid");
    }

    if (!this.operationCategoryElement.value) {
      this.operationCategoryElement.classList.add("is-invalid");
    } else {
      this.operationCategoryElement.classList.remove("is-invalid");
    }

    if (
      !this.operationAmountElement.value ||
      this.operationAmountElement.value < 0
    ) {
      this.operationAmountElement.classList.add("is-invalid");
    } else {
      this.operationAmountElement.classList.remove("is-invalid");
    }

    if (!this.operationDateElement.value) {
      this.operationDateElement.classList.add("is-invalid");
    } else {
      this.operationDateElement.classList.remove("is-invalid");
    }

    if (!this.operationCommentElement.value) {
      this.operationCommentElement.classList.add("is-invalid");
    } else {
      this.operationCommentElement.classList.remove("is-invalid");
    }

    const body = {
      type: this.operationTypeElement.value,
      amount: this.operationAmountElement.value,
      date: this.operationDateElement.value.split(".").reverse().join("-"),
      comment: this.operationCommentElement.value,
      category_id: +this.operationCategoryElement.value,
    };

    const result = await Requests.request("/operations", "POST", true, body);

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при создании операции. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.openNewRoute("/income-and-expenses");
  }
}
