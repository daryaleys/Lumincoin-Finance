import { Requests } from "../../helpers/requests.ts";
import { UserInfo } from "../../helpers/userInfo.ts";
import { LoginResponseType, RegisterResponseType } from "../../types/auth-response.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class Register {
	private openNewRoute: OpenNewRouteType;
	private nameInputElement: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement | null;
	private lastNameInputElement: HTMLInputElement | null = document.getElementById("last-name") as HTMLInputElement | null;
	private emailInputElement: HTMLInputElement | null = document.getElementById("email") as HTMLInputElement | null;
	private passwordInputElement: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement | null;
	private repeatPasswordInputElement: HTMLInputElement | null = document.getElementById("password-repeat") as HTMLInputElement | null;
	private commonErrorElement: HTMLElement | null = document.getElementById("common-error");

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		if (UserInfo.getUserInfo().accessToken) {
			this.openNewRoute("/");
			return;
		}

		const registerButton: HTMLElement | null = document.getElementById("register-button");
		if (registerButton) {
			registerButton.addEventListener("click", this.register.bind(this));
		}
	}

	private validateForm(): boolean {
		let isValid: boolean = true;

		if (this.nameInputElement) {
			if (this.nameInputElement.value) {
				this.nameInputElement.classList.remove("is-invalid");
			} else {
				this.nameInputElement.classList.add("is-invalid");
			}
		}

		if (this.lastNameInputElement) {
			if (this.lastNameInputElement.value) {
				this.lastNameInputElement.classList.remove("is-invalid");
			} else {
				this.lastNameInputElement.classList.add("is-invalid");
			}
		}

		if (this.emailInputElement) {
			if (this.emailInputElement.value && this.emailInputElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
				this.emailInputElement.classList.remove("is-invalid");
			} else {
				this.emailInputElement.classList.add("is-invalid");
				isValid = false;
			}
		}

		if (this.passwordInputElement) {
			if (this.passwordInputElement.value && this.passwordInputElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
				this.passwordInputElement.classList.remove("is-invalid");
			} else {
				this.passwordInputElement.classList.add("is-invalid");
				isValid = false;
			}
		}

		if (this.repeatPasswordInputElement && this.passwordInputElement) {
			if (this.repeatPasswordInputElement.value && this.repeatPasswordInputElement.value === this.passwordInputElement.value) {
				this.repeatPasswordInputElement.classList.remove("is-invalid");
			} else {
				this.repeatPasswordInputElement.classList.add("is-invalid");
				isValid = false;
			}
		}

		return isValid;
	}

	private async register(): Promise<void> {
		if (this.commonErrorElement) {
			this.commonErrorElement.style.display = "none";
		}

		if (this.validateForm()) {
			if (this.emailInputElement && this.nameInputElement && this.lastNameInputElement && this.passwordInputElement && this.repeatPasswordInputElement) {
				const registerBody = {
					name: this.nameInputElement.value,
					lastName: this.lastNameInputElement.value,
					email: this.emailInputElement.value,
					password: this.passwordInputElement.value,
					passwordRepeat: this.repeatPasswordInputElement.value,
				};

				const result: CommonResultType | RegisterResponseType = await Requests.request("/signup", "POST", false, JSON.stringify(registerBody));

				if ((result as CommonResultType).error || !(result as RegisterResponseType).user) {
					if (this.commonErrorElement) {
						this.commonErrorElement.style.display = "block";
						if ((result as CommonResultType).message === "User with given email already exist") {
							this.commonErrorElement.innerText = "Пользователь с таким email уже зарегистрирован";
						}
					}

					return;
				}

				const loginBody = {
					email: this.emailInputElement.value,
					password: this.passwordInputElement.value,
					rememberMe: false,
				};

				const result2: CommonResultType | LoginResponseType = await Requests.request("/login", "POST", false, JSON.stringify(loginBody));

				if (((result2 as CommonResultType).error || !(result2 as LoginResponseType).tokens || !(result2 as LoginResponseType).user) && this.commonErrorElement) {
					this.commonErrorElement.style.display = "block";
					return;
				}

				UserInfo.setUserInfo(
					(result2 as LoginResponseType).tokens.accessToken,
					(result2 as LoginResponseType).tokens.refreshToken,
					(result2 as LoginResponseType).user.id.toString(),
					(result2 as LoginResponseType).user.name,
					(result2 as LoginResponseType).user.lastName
				);

				this.openNewRoute("/");
			}
		}
	}
}
