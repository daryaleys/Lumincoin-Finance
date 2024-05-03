import { Requests } from "../../helpers/requests";

export class Operations {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.filterButtons = document.querySelectorAll(".filter-button");
    this.filterButtons.forEach((button) =>
      button.addEventListener("click", this.chooseInterval.bind(this))
    );

    this.dateFromElement = document.getElementById("startDate");
    this.dateToElement = document.getElementById("endDate");

    this.tableElement = document.getElementById("tbody");
    this.deleteOperationButton = document.getElementById(
      "delete-operation-button"
    );

    $("#startDate").datepicker({
      format: "mm.dd.yy",
      locale: "ru",
    });
    $("#endDate").datepicker({
      format: "mm.dd.yy",
      locale: "ru",
    });

    this.getOperations().then();
  }

  chooseInterval(e) {
    this.dateFromElement.setAttribute("disabled", "disabled");
    this.dateFromElement.value = "";
    this.dateToElement.setAttribute("disabled", "disabled");
    this.dateToElement.value = "";

    this.filterButtons.forEach((button) => {
      button.classList.add(
        "border",
        "border-secondary",
        "text-secondary",
        "btn-tertiary"
      );
      button.classList.remove("btn-secondary");
    });

    e.target.classList.remove(
      "border",
      "border-secondary",
      "text-secondary",
      "btn-tertiary"
    );
    e.target.classList.add("btn-secondary");

    const filter = e.target.dataset.filter;
    if (filter === "interval") {
      this.dateFromElement.removeAttribute("disabled");
      this.dateToElement.removeAttribute("disabled");
    }
  }

  async getOperations() {
    const result = await Requests.request(
      "/operations?period=all",
      "GET",
      true
    );

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе операций. Пожалуйста, обратитесь в поддержку"
      );
    }

    this.showOperations(result);
  }

  showOperations(operations) {
    this.tableElement.querySelectorAll("tr").forEach((tr) => tr.remove());

    operations.forEach((operation, index) => {
      const trElement = document.createElement("tr");
      trElement.setAttribute("data-operation", operation.id);

      const tdNumberElement = document.createElement("th");
      tdNumberElement.classList.add("text-center");
      tdNumberElement.innerText = index + 1;

      const tdOperationType = document.createElement("td");
      tdOperationType.classList.add("text-center");
      if (operation.type === "income") {
        tdOperationType.innerText = "доход";
        tdOperationType.classList.add("text-success");
      } else {
        tdOperationType.innerText = "расход";
        tdOperationType.classList.add("text-danger");
      }

      const tdOperationCategory = document.createElement("td");
      tdOperationCategory.classList.add("text-center");
      tdOperationCategory.innerText = operation.category;

      const tdAmountElement = document.createElement("td");
      tdAmountElement.classList.add("text-center");
      tdAmountElement.innerText = operation.amount + "$";

      const tdDateElement = document.createElement("td");
      tdDateElement.classList.add("text-center");
      tdDateElement.innerText = operation.date.split("-").reverse().join(".");

      const tdCommentElement = document.createElement("td");
      tdCommentElement.classList.add("text-center");
      tdCommentElement.innerText = operation.comment;

      const tdActionsElement = document.createElement("td");
      tdActionsElement.classList.add("d-flex", "gap-2", "justify-content-end");

      const deleteIconElement = document.createElement("div");
      deleteIconElement.classList.add("delete-action");
      deleteIconElement.setAttribute("data-bs-toggle", "modal");
      deleteIconElement.setAttribute("data-bs-target", "#modal");
      deleteIconElement.setAttribute("role", "button");

      const deleteIconImage = document.createElement("img");
      deleteIconImage.setAttribute("src", "../../../assets/delete-action.svg");
      deleteIconImage.addEventListener(
        "click",
        this.deleteOperation.bind(this)
      );

      deleteIconElement.appendChild(deleteIconImage);

      const editIconElement = document.createElement("a");
      editIconElement.setAttribute(
        "href",
        "/income-expense-edit?operation=" + operation.id
      );
      editIconElement.classList.add("edit-action", "text-black");

      const editIconImage = document.createElement("img");
      editIconImage.setAttribute("src", "../../../assets/edit-action.svg");

      editIconElement.appendChild(editIconImage);

      tdActionsElement.appendChild(deleteIconElement);
      tdActionsElement.appendChild(editIconElement);

      trElement.appendChild(tdNumberElement);
      trElement.appendChild(tdOperationType);
      trElement.appendChild(tdOperationCategory);
      trElement.appendChild(tdAmountElement);
      trElement.appendChild(tdDateElement);
      trElement.appendChild(tdCommentElement);
      trElement.appendChild(tdActionsElement);

      this.tableElement.appendChild(trElement);
    });
  }

  deleteOperation(e) {
    let operationId = -1;
    console.log(e.target);
    const trElement = e.target.parentElement.parentElement.parentElement;
    if (trElement && trElement.dataset.operation) {
      operationId = trElement.dataset.operation;
    }

    this.deleteOperationButton.onclick = async () => {
      const result = await Requests.request(
        "/operations/" + operationId,
        "DELETE",
        true
      );

      if (result.error) {
        return alert(
          "Возникла ошибка при удалении операции. Пожалуйста, обратитесь в поддержку"
        );
      }

      await this.getOperations();
    };
  }
}
