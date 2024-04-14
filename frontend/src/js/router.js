import {Main} from "./components/main";
import {IncomeAndExpenses} from "./components/income-and-expenses";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";

export class Router {
    constructor() {
        this.activateNewItem();

        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                filePathTemplate: '/pages/main.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '/income-and-expenses',
                filePathTemplate: '/pages/income-and-expenses.html',
                load: () => {
                    new IncomeAndExpenses();
                }
            },
            {
                route: '/income',
                filePathTemplate: '/pages/income.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '/expenses',
                filePathTemplate: '/pages/expenses.html',
                load: () => {
                    new Expenses();
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
                this.contentPageElement.innerHTML = await fetch(currentUrl.filePathTemplate).then(response => response.text());
            }

            if (currentUrl.load) {
                currentUrl.load()
            }

        } else {
            console.log(':(')
        }
    }

    activateNewItem() {
        const clearItems = (items) => {
            items.forEach(oldItem => {
                oldItem.classList.remove('active');
                oldItem.classList.add('link-dark');
            })
        }

        const toggleItemClasses = (item) => {
            item.classList.toggle('active');
            item.classList.toggle('link-dark');
        }

        const menuCollapsibleWrapper = document.querySelector('#collapsible-menu-wrapper');
        const menuCollapsible = document.querySelector('#collapsible-menu');
        const menuCollapsibleButton = document.querySelector('.nav-link-button');
        const toggleMenu = () => {
            menuCollapsibleButton.classList.toggle('expanded');
            menuCollapsible.classList.toggle('show');
        }
        menuCollapsibleButton.addEventListener('click', toggleMenu);

        const menuItems = document.querySelectorAll('.sidebar .nav-link-item');
        menuItems.forEach(item => item.addEventListener('click', async (e) => {
            e.preventDefault();

            history.pushState({}, '', item.getAttribute('href'));
            await this.activateRoute();

            clearItems(menuItems);
            toggleItemClasses(item);

            if (item.classList.contains('collapsible')) {
                menuCollapsibleWrapper.classList.add('border', 'border-primary');
                menuCollapsibleButton.classList.add('active', 'rounded-0');
                menuCollapsibleButton.classList.remove('link-dark');

            } else {
                menuCollapsibleWrapper.classList.remove('border', 'border-primary');
                menuCollapsibleButton.classList.remove('rounded-0', 'active');
                menuCollapsibleButton.classList.add('link-dark');
                if (menuCollapsibleButton.classList.contains('expanded')) {
                    toggleMenu()
                }
            }
        }))
    }
}