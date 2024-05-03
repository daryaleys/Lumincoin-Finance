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

    this.currentOperation = {
      type: "",
      amount: 0,
      date: "",
      comment: "",
      category: {
        id: 0,
        title: "",
      },
    };

    $("#operation-date").datepicker({
      format: "dd.mm.yyyy",
      locale: "ru",
    });

    this.operationTypeElement.addEventListener("change", (e) => {
      this.getCategories(e.target.value);
      console.log(e.target.value);
    });

    document
      .getElementById("edit-operation-button")
      .addEventListener("click", this.editOperation.bind(this));

    let url = new URL(window.location);
    this.operationId = url.searchParams.get("operation");
    if (!this.operationId) {
      return this.openNewRoute("/income-and-expenses");
    }

    this.getOperation(this.operationId);
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

    Object.keys(this.currentOperation).forEach((field) => {
      if (field === "category") {
        this.currentOperation.category.title = result.category;
      } else {
        this.currentOperation[field] = result[field];
      }
    });

    this.getCategories(result.type);
    this.showCurrentOperation();
  }

  async getCategories(operationType) {
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

    if (!this.currentOperation.category.id) {
      const currentCategory = result.find(
        (category) => category.title === this.currentOperation.category.title
      );
      this.currentOperation.category.id = currentCategory.id;
    }

    this.addCategoriesToSelect(result);
  }

  addCategoriesToSelect(categories) {
    this.operationCategoryElement
      .querySelectorAll("option")
      .forEach((option) => option.remove());

    categories.forEach((category) => {
      const optionElement = document.createElement("option");
      optionElement.value = category.id;
      optionElement.innerText = category.title;
      this.operationCategoryElement.appendChild(optionElement);
    });
  }

  showCurrentOperation() {
    this.operationTypeElement.value = this.currentOperation.type;
    this.operationCategoryElement.value = this.currentOperation.category.id;
    this.operationAmountElement.value = this.currentOperation.amount;
    this.operationDateElement.value = this.currentOperation.date
      .split("-")
      .reverse()
      .join(".");
    this.operationCommentElement.value = this.currentOperation.comment;
  }

  validateForm() {
    let isValid = true;

    if (!this.operationTypeElement.value) {
      this.operationTypeElement.classList.add("is-invalid");
      isValid = false;
    } else {
      this.operationTypeElement.classList.remove("is-invalid");
    }

    if (!this.operationCategoryElement.value) {
      this.operationCategoryElement.classList.add("is-invalid");
      isValid = false;
    } else {
      this.operationCategoryElement.classList.remove("is-invalid");
    }

    if (
      !this.operationAmountElement.value ||
      this.operationAmountElement.value < 0
    ) {
      this.operationAmountElement.classList.add("is-invalid");
      isValid = false;
    } else {
      this.operationAmountElement.classList.remove("is-invalid");
    }

    if (!this.operationDateElement.value) {
      this.operationDateElement.classList.add("is-invalid");
      isValid = false;
    } else {
      this.operationDateElement.classList.remove("is-invalid");
    }

    if (!this.operationCommentElement.value) {
      this.operationCommentElement.classList.add("is-invalid");
      isValid = false;
    } else {
      this.operationCommentElement.classList.remove("is-invalid");
    }

    return isValid;
  }

  async editOperation() {
    if (this.validateForm()) {
      const body = {
        type: this.operationTypeElement.value,
        amount: this.operationAmountElement.value,
        date: this.operationDateElement.value.split(".").reverse().join("-"),
        comment: this.operationCommentElement.value,
        category_id: +this.operationCategoryElement.value,
      };

      const result = await Requests.request(
        "/operations/" + this.operationId,
        "PUT",
        true,
        body
      );

      if (result.redirect) {
        this.openNewRoute(result.redirect);
      }

      if (result.error) {
        return alert(
          "Возникла ошибка при редактировании операции. Пожалуйста, обратитесь в поддержку"
        );
      }

      this.openNewRoute("/income-and-expenses");
    }
  }
}
