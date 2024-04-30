import {UserInfo} from "../../helpers/userInfo";
import {Requests} from "../../helpers/requests";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!UserInfo.getUserInfo().accessToken) {
            return this.openNewRoute('/')
        }

        this.logout().then()
    }

    async logout() {
        await Requests.logout({refreshToken: UserInfo.getUserInfo().refreshToken});
        UserInfo.removeUserInfo();
        this.openNewRoute('/login');
    }
}