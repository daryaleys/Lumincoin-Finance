import { Requests } from "../../helpers/requests.ts";
import { UserInfo } from "../../helpers/userInfo.ts";

export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (UserInfo.getUserInfo().accessToken) {
      return this.openNewRoute("/");
    }

    this.emailElement = document.getElementById("email");
    this.passwordElement = document.getElementById("password");
    this.rememberMeElement = document.getElementById("remember-me");
    this.commonErrorElement = document.getElementById("common-error");

    document
      .getElementById("login-button")
      .addEventListener("click", this.login.bind(this));
  }

  validateForm() {
    let isValid = true;

    if (
      this.emailElement.value &&
      this.emailElement.value.match(
        /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      )
    ) {
      this.emailElement.classList.remove("is-invalid");
    } else {
      this.emailElement.classList.add("is-invalid");
      isValid = false;
    }

    if (this.passwordElement.value) {
      this.passwordElement.classList.remove("is-invalid");
    } else {
      this.passwordElement.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  async login() {
    this.commonErrorElement.style.display = "none";

    if (this.validateForm()) {
      const body = {
        email: this.emailElement.value,
        password: this.passwordElement.value,
        rememberMe: this.rememberMeElement.checked,
      };

      const result = await Requests.request("/login", "POST", false, body);

      if (result.error || !result.tokens || !result.user) {
        this.commonErrorElement.style.display = "block";
        return;
      }

      UserInfo.setUserInfo(
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.user.id,
        result.user.name,
        result.user.lastName
      );
      this.openNewRoute("/");
    }
  }
}
