import {Main} from "./components/main";
import {IncomeAndExpenses} from "./components/income-and-expenses";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {Login} from "./components/login";
import {Register} from "./components/register";

export class Router {
    constructor() {
        this.contentPageElement = document.getElementById('content');
        this.initEvents();

        this.routes = [
            {
                route: '/',
                filePathTemplate: '/pages/templates/main.html',
                useLayout: '/pages/layout.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '/income-and-expenses',
                filePathTemplate: '/pages/templates/income-and-expenses.html',
                useLayout: '/pages/layout.html',
                load: () => {
                    new IncomeAndExpenses();
                }
            },
            {
                route: '/income',
                filePathTemplate: '/pages/templates/income.html',
                useLayout: '/pages/layout.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '/expenses',
                filePathTemplate: '/pages/templates/expenses.html',
                useLayout: '/pages/layout.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '/login',
                filePathTemplate: '/pages/templates/login.html',
                load: () => {
                    new Login();
                }
            },
            {
                route: '/register',
                filePathTemplate: '/pages/templates/register.html',
                load: () => {
                    new Register();
                }
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const url = window.location.pathname;
        const currentUrl = this.routes.find(item => item.route === url);

        if (currentUrl) {
            if (currentUrl.filePathTemplate) {

                let contentBlock = this.contentPageElement;

                if (currentUrl.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(currentUrl.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('layout-content');
                    this.menuClickHandle(currentUrl);
                }

                contentBlock.innerHTML = await fetch(currentUrl.filePathTemplate).then(response => response.text());
            }

            if (currentUrl.load) {
                currentUrl.load()
            }

        } else {
            console.log(':(')
        }
    }

    menuClickHandle(currentUrl) {
        const menuCollapsibleWrapper = document.querySelector('#collapsible-menu-wrapper');
        const menuCollapsible = document.querySelector('#collapsible-menu');
        const menuCollapsibleButton = document.querySelector('.nav-link-button');
        const toggleMenu = () => {
            menuCollapsibleButton.classList.toggle('expanded');
            menuCollapsible.classList.toggle('show');
        }
        menuCollapsibleButton.addEventListener('click', toggleMenu);

        document.querySelectorAll('.sidebar .nav-link-item').forEach(item => {
            const href = item.getAttribute('href');

            if ((currentUrl.route.includes(href) && href !== '/' && href !== '/income') || (currentUrl.route === '/' && href === '/') || (currentUrl.route === '/income' && href === '/income')) {
                item.classList.add('active');
                item.classList.remove('link-dark');
                if (item.classList.contains('collapsible')) {
                    menuCollapsibleWrapper.classList.add('border', 'border-primary');
                    menuCollapsibleButton.classList.add('active', 'rounded-0');
                    menuCollapsibleButton.classList.remove('link-dark');
                    if (!menuCollapsibleButton.classList.contains('expanded')) {
                        toggleMenu()
                    }
                }
            } else {
                item.classList.remove('active');
                item.classList.add('link-dark');
                if (!item.classList.contains('collapsible')) {
                    menuCollapsibleWrapper.classList.remove('border', 'border-primary');
                    menuCollapsibleButton.classList.remove('rounded-0', 'active');
                    menuCollapsibleButton.classList.add('link-dark');
                    if (menuCollapsibleButton.classList.contains('expanded')) {
                        toggleMenu()
                    }
                }
            }
        });
    }
}