import { CommonResultType, RefreshResultType, RequestHeadersType, RequestParamsType } from "../types/requests.type";
import { UserInfo } from "./userInfo";

export class Requests {
	private static host: string = "http://localhost:3000/api";
	private static headers: RequestHeadersType = {
		"Content-type": "application/json",
		Accept: "application/json",
	};

	private static async refresh(): Promise<RefreshResultType | CommonResultType> {
		const refreshToken: string | null = UserInfo.getUserInfo().refreshToken;

		const response: Response = await fetch(this.host + "/refresh", {
			method: "POST",
			headers: this.headers,
			body: JSON.stringify({ refreshToken: refreshToken }),
		});

		const result: RefreshResultType | CommonResultType = await response.json();

		if (!result || (result as CommonResultType).error || !(result as RefreshResultType).tokens) {
			UserInfo.removeUserInfo();
			(result as CommonResultType).redirect = "/login";
		} else {
			const userInfoString: string | null = UserInfo.getUserInfo().userInfo;
			if (userInfoString) {
				const user = JSON.parse(userInfoString);
				UserInfo.setUserInfo((result as RefreshResultType).tokens.accessToken, (result as RefreshResultType).tokens.refreshToken, user.id, user.name, user.lastName);
			}
		}

		return result;
	}

	public static async request(url: string, method: string, useAuth: boolean, body: string | null = null): Promise<any> {
		const accessToken: string | null = UserInfo.getUserInfo().accessToken;

		if (useAuth) {
			this.headers["x-auth-token"] = accessToken as string | undefined;
		}

		const params: RequestParamsType = {
			method: method,
			headers: this.headers,
		};

		if (body) {
			params.body = JSON.stringify(body);
		}

		const response: Response = await fetch(this.host + url, params);

		const result = await response.json();

		if (useAuth && response.status === 401) {
			if (!accessToken) {
				result.redirect = "/login";
				return result;
			} else {
				const refreshResult: RefreshResultType | CommonResultType = await this.refresh();
				if ((refreshResult as CommonResultType).redirect) {
					return refreshResult;
				}
				return await this.request(url, method, useAuth, body);
			}
		}

		return result;
	}
}
