import {UserInfo} from "./userInfo";

export class Requests {
    static host = "http://localhost:3000/api"
    static headers = {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    }

    static async login(body) {
        const response = await fetch(this.host + '/login', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }

    static async register(body) {
        const response = await fetch(this.host + '/signup', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }

    static async logout(body) {
        const response = await fetch(this.host + '/logout', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }

    static async refresh() {
        const refreshToken = UserInfo.getUserInfo().refreshToken;

        const response = await fetch(this.host + '/refresh', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({refreshToken: refreshToken})
        })

        const result = await response.json()

        if (!result || result.error || !result.tokens) {
            UserInfo.removeUserInfo();
            result.redirect = '/login';
        } else {
            const user = JSON.parse(UserInfo.getUserInfo().userInfo)
            UserInfo.setUserInfo(result.tokens.accessToken, result.tokens.refreshToken, user.id, user.name, user.lastName);
        }

        return result
    }

    static async getBalance() {
        const accessToken = UserInfo.getUserInfo().accessToken;
        if (accessToken) {
            this.headers["x-auth-token"] = accessToken;
        }

        const response = await fetch(this.host + '/balance', {
            method: 'GET',
            headers: this.headers,
        })

        const result = await response.json();

        if (response.status === 401) { // остальные ошибки обрабатываются на месте вызова функции
            if (!accessToken) {
                result.redirect = '/login'
                return result
            } else {
                const refreshResult = await this.refresh();
                if (refreshResult.redirect) {
                    return refreshResult
                }
                return await this.getBalance()
            }
        }

        return result
    }
}