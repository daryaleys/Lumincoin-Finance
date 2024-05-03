import { Requests } from "../../helpers/requests";

export class Income {
  constructor() {
    this.categoryCardsList = document.getElementById("category-cards-list");
    this.deleteCategoryButton = document.getElementById(
      "delete-category-button"
    );
    this.appendCategoryButton = document.getElementById(
      "append-category-button"
    );

    this.getCategories().then();
  }

  async getCategories() {
    const result = await Requests.request("/categories/income", "GET", true);

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

  showCategories(categories) {
    categories.forEach((category) =>
      this.createCategoryCard(category.id, category.title)
    );
  }

  createCategoryCard(id, title) {
    const category = document.createElement("div");
    const categoryCard = document.createElement("div");
    const categoryCardBody = document.createElement("div");

    category.classList.add("col");
    categoryCard.classList.add(
      "card",
      "mb-4",
      "rounded-4",
      "border",
      "border-2"
    );
    categoryCardBody.classList.add("card-body");
    categoryCardBody.setAttribute("data-category", id);

    category.appendChild(categoryCard);
    categoryCard.appendChild(categoryCardBody);

    const categoryTitle = document.createElement("h5");
    categoryTitle.classList.add(
      "card-title",
      "fw-medium",
      "text-primary-emphasis",
      "fs-3",
      "mb-3"
    );
    categoryTitle.innerText = title;

    const categoryEditLink = document.createElement("a");
    categoryEditLink.classList.add(
      "btn",
      "btn-primary",
      "d-inline-flex",
      "align-items-center",
      "py-2",
      "px-3"
    );
    categoryEditLink.innerText = "Редактировать";
    categoryEditLink.setAttribute("href", `/income-edit?category=${id}`);

    const categoryDeleteButton = document.createElement("button");
    categoryDeleteButton.classList.add(
      "btn",
      "btn-danger",
      "d-inline-flex",
      "align-items-center",
      "py-2",
      "px-3",
      "ms-2",
      "card-delete-category"
    );
    categoryDeleteButton.setAttribute("type", "button");
    categoryDeleteButton.setAttribute("data-bs-toggle", "modal");
    categoryDeleteButton.setAttribute("data-bs-target", "#modal");
    categoryDeleteButton.addEventListener(
      "click",
      this.deleteCategory.bind(this)
    );
    categoryDeleteButton.innerText = "Удалить";

    categoryCardBody.appendChild(categoryTitle);
    categoryCardBody.appendChild(categoryEditLink);
    categoryCardBody.appendChild(categoryDeleteButton);

    this.categoryCardsList.insertBefore(category, this.appendCategoryButton);
  }

  deleteCategory(e) {
    let categoryId = -1;
    const cardElement = e.target.parentElement;
    if (cardElement && cardElement.dataset.category) {
      categoryId = cardElement.dataset.category;
    }

    this.deleteCategoryButton.onclick = async () => {
      const result = await Requests.request(
        "/categories/income/" + categoryId,
        "DELETE",
        true
      );

      if (result.error) {
        return alert(
          "Возникла ошибка при удалении категории. Пожалуйста, обратитесь в поддержку"
        );
      }

      cardElement.parentElement.parentElement.remove();
    };
  }
}
