import { UserInfo } from "./userInfo";

export class Requests {
  static host = "http://localhost:3000/api";
  static headers = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  static async refresh() {
    const refreshToken = UserInfo.getUserInfo().refreshToken;

    const response = await fetch(this.host + "/refresh", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const result = await response.json();

    if (!result || result.error || !result.tokens) {
      UserInfo.removeUserInfo();
      result.redirect = "/login";
    } else {
      const user = JSON.parse(UserInfo.getUserInfo().userInfo);
      UserInfo.setUserInfo(
        result.tokens.accessToken,
        result.tokens.refreshToken,
        user.id,
        user.name,
        user.lastName
      );
    }

    return result;
  }

  static async request(url, method, useAuth, body = null) {
    const accessToken = UserInfo.getUserInfo().accessToken;

    if (useAuth) {
      this.headers["x-auth-token"] = accessToken;
    }

    const params = {
      method: method,
      headers: this.headers,
    };

    if (body) {
      params.body = JSON.stringify(body);
    }

    const response = await fetch(this.host + url, params);

    const result = await response.json();

    if (useAuth && response.status === 401) {
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.request(url, method, useAuth, body);
      }
    }

    return result;
  }
}
