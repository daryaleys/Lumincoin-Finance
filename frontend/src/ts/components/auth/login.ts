import { Requests } from "../../helpers/requests.ts";
import { UserInfo } from "../../helpers/userInfo.ts";
import { LoginResponseType } from "../../types/auth-response.type.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";
import { CommonResultType } from "../../types/requests.type.ts";

export class Login {
	private openNewRoute: OpenNewRouteType;

	private emailElement: HTMLInputElement | null = document.getElementById("email") as HTMLInputElement | null;
	private passwordElement: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement | null;
	private rememberMeElement: HTMLInputElement | null = document.getElementById("remember-me") as HTMLInputElement | null;
	private commonErrorElement: HTMLElement | null = document.getElementById("common-error");

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		if (UserInfo.getUserInfo().accessToken) {
			this.openNewRoute("/");
			return;
		}

		const loginButton: HTMLElement | null = document.getElementById("login-button");
		if (loginButton) {
			loginButton.addEventListener("click", this.login.bind(this));
		}
	}

	private validateForm(): boolean {
		let isValid: boolean = true;

		if (this.emailElement) {
			if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
				this.emailElement.classList.remove("is-invalid");
			} else {
				this.emailElement.classList.add("is-invalid");
				isValid = false;
			}
		}

		if (this.passwordElement) {
			if (this.passwordElement.value) {
				this.passwordElement.classList.remove("is-invalid");
			} else {
				this.passwordElement.classList.add("is-invalid");
				isValid = false;
			}
		}

		return isValid;
	}

	private async login(): Promise<void> {
		if (this.commonErrorElement) {
			this.commonErrorElement.style.display = "none";
		}

		if (this.validateForm()) {
			if (this.emailElement && this.passwordElement && this.rememberMeElement) {
				const body = {
					email: this.emailElement.value,
					password: this.passwordElement.value,
					rememberMe: this.rememberMeElement.checked,
				};

				const result: CommonResultType | LoginResponseType = await Requests.request("/login", "POST", false, JSON.stringify(body));

				if (((result as CommonResultType).error || !(result as LoginResponseType).tokens || !(result as LoginResponseType).user) && this.commonErrorElement) {
					this.commonErrorElement.style.display = "block";
					return;
				}

				UserInfo.setUserInfo(
					(result as LoginResponseType).tokens.accessToken,
					(result as LoginResponseType).tokens.refreshToken,
					(result as LoginResponseType).user.id.toString(),
					(result as LoginResponseType).user.name,
					(result as LoginResponseType).user.lastName
				);
				this.openNewRoute("/");
			}
		}
	}
}
