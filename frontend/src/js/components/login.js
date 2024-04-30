import {Requests} from "../helpers/requests";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.emailElement = document.getElementById("email");
        this.passwordElement = document.getElementById("password");
        this.rememberMeElement = document.getElementById("remember-me");
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById("login-button").addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const body = {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            }

            const result = await Requests.login(body);

            if (result.error || !result.tokens || !result.user) {
                this.commonErrorElement.style.display = 'block';
                return
            }

            localStorage.setItem('accessToken', result.tokens.accessToken);
            localStorage.setItem('refreshToken', result.tokens.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({id: result.user.id, name: result.user.name, lastName: result.user.lastName}));

            this.openNewRoute('/');
        }
    }
}