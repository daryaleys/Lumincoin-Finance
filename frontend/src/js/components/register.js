export class Register {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

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
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.nameInputElement.value,
                    lastName: this.lastNameInputElement.value,
                    email: this.emailInputElement.value,
                    password: this.passwordInputElement.value,
                    passwordRepeat: this.repeatPasswordInputElement.value
                })
            })

            const result = await response.json();

            if (result.error || !result.user) {
                this.commonErrorElement.style.display = 'block';

                if (response.status === 400 && result.message === "User with given email already exist") {
                    this.commonErrorElement.innerText = "Пользователь с таким email уже зарегистрирован";
                }

                return;
            }



            localStorage.setItem('userInfo', JSON.stringify({id: result.user.id, name: result.user.name, lastName: result.user.lastName}));


            // this.openNewRoute('/');
        }
    }
}