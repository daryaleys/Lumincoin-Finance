import { Main } from "./components/main";
import { Operations } from "./components/operations/operations";
import { OperationAdd } from "./components/operations/operation-add";
import { OperationEdit } from "./components/operations/operation-edit";
import { Income } from "./components/income/income";
import { IncomeCreate } from "./components/income/income-create";
import { IncomeEdit } from "./components/income/income-edit";
import { Expenses } from "./components/expenses/expenses";
import { ExpensesCreate } from "./components/expenses/expenses-create";
import { ExpensesEdit } from "./components/expenses/expenses-edit";
import { Login } from "./components/auth/login";
import { Register } from "./components/auth/register";
import { Logout } from "./components/auth/logout";
import { UserInfo } from "./helpers/userInfo";
import { Requests } from "./helpers/requests";

export class Router {
  constructor() {
    this.contentPageElement = document.getElementById("content");
    this.initEvents();

    this.routes = [
      {
        route: "/",
        filePathTemplate: "/pages/templates/main.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new Main(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-and-expenses",
        filePathTemplate: "/pages/templates/operations/operations.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new Operations(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-expense-add",
        filePathTemplate: "/pages/templates/operations/add-operation.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new OperationAdd(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-expense-edit",
        filePathTemplate: "/pages/templates/operations/edit-operation.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new OperationEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income",
        filePathTemplate: "/pages/templates/income/income.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new Income(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-create",
        filePathTemplate: "/pages/templates/income/income-create.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new IncomeCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-edit",
        filePathTemplate: "/pages/templates/income/income-edit.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new IncomeEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses",
        filePathTemplate: "/pages/templates/expenses/expenses.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new Expenses(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-create",
        filePathTemplate: "/pages/templates/expenses/expenses-create.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new ExpensesCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-edit",
        filePathTemplate: "/pages/templates/expenses/expenses-edit.html",
        useLayout: "/pages/layout.html",
        needAuth: true,
        load: () => {
          new ExpensesEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/login",
        filePathTemplate: "/pages/templates/login.html",
        needAuth: false,
        load: () => {
          new Login(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/register",
        filePathTemplate: "/pages/templates/register.html",
        needAuth: false,
        load: () => {
          new Register(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/logout",
        load: () => {
          new Logout(this.openNewRoute.bind(this));
        },
      },
    ];
  }

  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.linksHandle.bind(this));
  }

  async openNewRoute(url) {
    history.pushState({}, "", url);
    await this.activateRoute();
  }

  async linksHandle(e) {
    let element = null;
    if (e.target.nodeName === "A") {
      element = e.target;
    } else {
      element = e.target.parentNode;
    }
    if (!element || !element.href || element.href === "/#") return;

    e.preventDefault();
    const newRoute = element.href.replace(window.location.origin, "");
    await this.openNewRoute(newRoute);
  }

  async activateRoute() {
    const url = window.location.pathname;
    const currentUrl = this.routes.find((item) => item.route === url);
    const isAuthed = UserInfo.getUserInfo().accessToken;

    if (currentUrl) {
      if (currentUrl.filePathTemplate) {
        let contentBlock = this.contentPageElement;

        if (currentUrl.useLayout) {
          if (isAuthed) {
            this.contentPageElement.innerHTML = await fetch(
              currentUrl.useLayout
            ).then((response) => response.text());
            contentBlock = document.getElementById("layout-content");
            this.activateSidebarButtons(currentUrl);
            await this.showUserInfo();
          } else {
            return await this.openNewRoute("/login");
          }
        }

        contentBlock.innerHTML = await fetch(currentUrl.filePathTemplate).then(
          (response) => response.text()
        );
      }

      if (currentUrl.load) {
        currentUrl.load();
      }
    } else {
      console.log(":(");
    }
  }

  activateSidebarButtons(currentUrl) {
    let route = currentUrl.route;

    if (route === "/income-create" || route === "/income-edit") {
      route = "/income";
    } else if (route === "/expenses-create" || route === "/expenses-edit") {
      route = "/expenses";
    } else if (
      route === "/income-expense-add" ||
      route === "/income-expense-edit"
    ) {
      route = "/income-and-expenses";
    }

    const menuCollapsibleWrapper = document.querySelector(
      "#collapsible-menu-wrapper"
    );
    const menuCollapsible = document.querySelector("#collapsible-menu");
    const menuCollapsibleButton = document.querySelector(".nav-link-button");
    const toggleMenu = () => {
      menuCollapsibleButton.classList.toggle("expanded");
      menuCollapsible.classList.toggle("show");
    };
    menuCollapsibleButton.addEventListener("click", toggleMenu);

    document.querySelectorAll(".sidebar .nav-link-item").forEach((item) => {
      const href = item.getAttribute("href");

      if (route === href) {
        item.classList.add("active");
        item.classList.remove("link-dark");
        if (item.classList.contains("collapsible")) {
          menuCollapsibleWrapper.classList.add("border", "border-primary");
          menuCollapsibleButton.classList.add("active", "rounded-0");
          menuCollapsibleButton.classList.remove("link-dark");
          if (!menuCollapsibleButton.classList.contains("expanded")) {
            toggleMenu();
          }
        }
      } else {
        item.classList.remove("active");
        item.classList.add("link-dark");
        if (!item.classList.contains("collapsible")) {
          menuCollapsibleWrapper.classList.remove("border", "border-primary");
          menuCollapsibleButton.classList.remove("rounded-0", "active");
          menuCollapsibleButton.classList.add("link-dark");
          if (menuCollapsibleButton.classList.contains("expanded")) {
            toggleMenu();
          }
        }
      }
    });
  }

  async showUserInfo() {
    const balanceResult = await Requests.request("/balance", "GET", true);

    if (balanceResult.redirect) {
      return await this.openNewRoute(balanceResult.redirect);
    }
    if (balanceResult.error) {
      return alert(
        "Возникла ошибка при запросе баланса. Обратитесь в поддержку"
      );
    }

    this.balanceElement = document.getElementById("balance");
    if (this.balanceElement) {
      this.balanceElement.innerText = balanceResult.balance.toString() + "$";
    }

    this.userNameElement = document.getElementById("layout-username");
    const userInfo = JSON.parse(UserInfo.getUserInfo().userInfo);
    if (this.userNameElement && userInfo) {
      this.userNameElement.innerText = userInfo.name + " " + userInfo.lastName;
    }
  }
}
