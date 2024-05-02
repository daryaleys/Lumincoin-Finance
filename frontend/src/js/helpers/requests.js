import { UserInfo } from "./userInfo";

export class Requests {
  static host = "http://localhost:3000/api";
  static headers = {
    "Content-type": "application/json",
    Accept: "application/json",
  };
  static authHeaders = {
    "Content-type": "application/json",
    Accept: "application/json",
    "x-auth-token": UserInfo.getUserInfo().accessToken,
  };

  static async login(body) {
    const response = await fetch(this.host + "/login", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  }

  static async register(body) {
    const response = await fetch(this.host + "/signup", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  }

  static async logout(body) {
    const response = await fetch(this.host + "/logout", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  }

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

  static async getBalance() {
    const response = await fetch(this.host + "/balance", {
      method: "GET",
      headers: this.authHeaders,
    });

    const result = await response.json();

    if (response.status === 401) {
      const accessToken = UserInfo.getUserInfo().accessToken;
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.getBalance();
      }
    }

    return result;
  }

  static async getCategories() {
    const response = await fetch(this.host + "/categories/income", {
      method: "GET",
      headers: this.authHeaders,
    });

    const result = await response.json();
    if (response.status === 401) {
      const accessToken = UserInfo.getUserInfo().accessToken;
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.getCategories();
      }
    }

    return result;
  }

  static async createCategory(body) {
    const response = await fetch(this.host + "/categories/income", {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (response.status === 401) {
      const accessToken = UserInfo.getUserInfo().accessToken;
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.createCategory(body);
      }
    }

    return result;
  }

  static async getCategory(categoryId) {
    const response = await fetch(
      this.host + "/categories/income/" + categoryId,
      {
        method: "GET",
        headers: this.authHeaders,
      }
    );

    const result = await response.json();
    if (response.status === 401) {
      const accessToken = UserInfo.getUserInfo().accessToken;
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.getCategory(categoryId);
      }
    }

    return result;
  }

  static async deleteCategory(categoryId) {
    const response = await fetch(
      this.host + "/categories/income/" + categoryId,
      {
        method: "DELETE",
        headers: this.authHeaders,
      }
    );

    const result = await response.json();
    if (response.status === 401) {
      const accessToken = UserInfo.getUserInfo().accessToken;
      if (!accessToken) {
        result.redirect = "/login";
        return result;
      } else {
        const refreshResult = await this.refresh();
        if (refreshResult.redirect) {
          return refreshResult;
        }
        return await this.deleteCategory(categoryId);
      }
    }

    return result;
  }
}
