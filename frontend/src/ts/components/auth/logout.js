import { UserInfo } from "../../helpers/userInfo.ts";
import { Requests } from "../../helpers/requests.ts";

export class Logout {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!UserInfo.getUserInfo().accessToken) {
      return this.openNewRoute("/");
    }

    this.logout().then();
  }

  async logout() {
    const refreshToken = UserInfo.getUserInfo().refreshToken;
    const body = {
      refreshToken: refreshToken,
    };
    await Requests.request("/logout", "POST", false, body);

    UserInfo.removeUserInfo();
    this.openNewRoute("/login");
  }
}
