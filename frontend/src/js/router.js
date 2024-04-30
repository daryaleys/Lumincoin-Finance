import {Main} from "./components/main";
import {IncomeAndExpenses} from "./components/income-and-expenses";
import {IncomeExpenseAdd} from "./components/income-expense-add";
import {IncomeExpenseEdit} from "./components/income-expense-edit";
import {Income} from "./components/income";
import {IncomeCreate} from "./components/income-create";
import {IncomeEdit} from "./components/income-edit";
import {Expenses} from "./components/expenses";
import {ExpensesCreate} from "./components/expenses-create";
import {ExpensesEdit} from "./components/expenses-edit";
import {Login} from "./components/login";
import {Register} from "./components/register";

export class Router {
    constructor() {
        this.contentPageElement = document.getElementById("content");
        this.initEvents();

        this.routes = [
            {
                route: "/",
                filePathTemplate: "/pages/templates/main.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new Main();
                },
            },
            {
                route: "/income-and-expenses",
                filePathTemplate: "/pages/templates/income-and-expenses.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new IncomeAndExpenses();
                },
            },
            {
                route: "/income-expense-add",
                filePathTemplate: "/pages/templates/income-expense-add.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new IncomeExpenseAdd();
                },
            },
            {
                route: "/income-expense-edit",
                filePathTemplate: "/pages/templates/income-expense-edit.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new IncomeExpenseEdit();
                },
            },
            {
                route: "/income",
                filePathTemplate: "/pages/templates/income.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new Income();
                },
            },
            {
                route: "/income-create",
                filePathTemplate: "/pages/templates/income-create.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new IncomeCreate();
                },
            },
            {
                route: "/income-edit",
                filePathTemplate: "/pages/templates/income-edit.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: "/expenses",
                filePathTemplate: "/pages/templates/expenses.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new Expenses();
                },
            },
            {
                route: "/expenses-create",
                filePathTemplate: "/pages/templates/expenses-create.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new ExpensesCreate();
                },
            },
            {
                route: "/expenses-edit",
                filePathTemplate: "/pages/templates/expenses-edit.html",
                useLayout: "/pages/layout.html",
                load: () => {
                    new ExpensesEdit();
                },
            },
            {
                route: "/login",
                filePathTemplate: "/pages/templates/login.html",
                load: () => {
                    new Login();
                },
            },
            {
                route: "/register",
                filePathTemplate: "/pages/templates/register.html",
                load: () => {
                    new Register();
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener("click", this.linksHandle.bind(this))
    }

    async openNewRoute(url) {
        history.pushState({}, '', url);
        await this.activateRoute();
    }

    async linksHandle(e) {
        e.preventDefault();

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else {
            element = e.target.parentNode;
        }
        if (!element || !element.href) return

        const newRoute = element.href.replace(window.location.origin, '');
        await this.openNewRoute(newRoute);
    }

    async activateRoute() {
        const url = window.location.pathname;
        const currentUrl = this.routes.find((item) => item.route === url);

        if (currentUrl) {
            if (currentUrl.filePathTemplate) {
                let contentBlock = this.contentPageElement;

                if (currentUrl.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(
                        currentUrl.useLayout
                    ).then((response) => response.text());
                    contentBlock = document.getElementById("layout-content");
                    this.activateSidebarButtons(currentUrl);
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
}
