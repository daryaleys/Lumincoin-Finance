import {Requests} from "../helpers/requests";
import {UserInfo} from "../helpers/userInfo";

export class Register {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (UserInfo.getUserInfo().accessToken) {
            return this.openNewRoute('/')
        }

        this.nameInputElement = document.getElementById("name");
        this.lastNameInputElement = document.getElementById("last-name");
        this.emailInputElement = document.getElementById("email");
        this.passwordInputElement = document.getElementById("password");
        this.repeatPasswordInputElement = document.getElementById("password-repeat");
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById("register-button").addEventListener('click', this.register.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameInputElement.value) {
            this.nameInputElement.classList.remove('is-invalid');
        } else {
            this.nameInputElement.classList.add('is-invalid');
        }

        if (this.lastNameInputElement.value) {
            this.lastNameInputElement.classList.remove('is-invalid');
        } else {
            this.lastNameInputElement.classList.add('is-invalid');
        }

        if (this.emailInputElement.value && this.emailInputElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordInputElement.value && this.passwordInputElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            this.passwordInputElement.classList.remove('is-invalid');
        } else {
            this.passwordInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.repeatPasswordInputElement.value && this.repeatPasswordInputElement.value === this.passwordInputElement.value) {
            this.repeatPasswordInputElement.classList.remove('is-invalid');
        } else {
            this.repeatPasswordInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async register() {
        this.commonErrorElement.style.display = "none";

        if (this.validateForm()) {
            const registerBody = {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                passwordRepeat: this.repeatPasswordInputElement.value
            }

            const result = await Requests.register(registerBody);

            if (result.error || !result.user) {
                this.commonErrorElement.style.display = 'block';
                if (result.message === "User with given email already exist") {
                    this.commonErrorElement.innerText = "Пользователь с таким email уже зарегистрирован";
                }
                return;
            }

            const loginBody = {
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                rememberMe: false
            }

            const result2 = await Requests.login(loginBody);

            if (result2.error || !result2.tokens || !result2.user) {
                this.commonErrorElement.style.display = 'block';
                return
            }

            UserInfo.setUserInfo(result2.tokens.accessToken, result2.tokens.refreshToken, result2.user.id, result2.user.name, result2.user.lastName);

            this.openNewRoute('/');
        }
    }
}