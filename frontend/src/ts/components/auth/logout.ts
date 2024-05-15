import { UserInfo } from "../../helpers/userInfo.ts";
import { Requests } from "../../helpers/requests.ts";
import { OpenNewRouteType } from "../../types/open-route.type.ts";

export class Logout {
	private openNewRoute: OpenNewRouteType;

	constructor(openNewRoute: OpenNewRouteType) {
		this.openNewRoute = openNewRoute;

		if (!UserInfo.getUserInfo().accessToken) {
			this.openNewRoute("/");
			return;
		}

		this.logout().then();
	}

	private async logout(): Promise<void> {
		const refreshToken: string | null = UserInfo.getUserInfo().refreshToken;
		if (refreshToken) {
			const body = {
				refreshToken: refreshToken,
			};
			await Requests.request("/logout", "POST", false, JSON.stringify(body));

			UserInfo.removeUserInfo();
			this.openNewRoute("/login");
		}
	}
}
