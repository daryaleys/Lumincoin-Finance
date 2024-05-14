import { CommonUserInfoType } from "../types/user-info.type";

export class UserInfo {
	public static setUserInfo(accessToken = "", refreshToken = "", id = "", name = "", lastName = ""): void {
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
		localStorage.setItem("userInfo", JSON.stringify({ id: id, name: name, lastName: lastName }));
	}

	public static getUserInfo(): CommonUserInfoType {
		return {
			accessToken: localStorage.getItem("accessToken"),
			refreshToken: localStorage.getItem("refreshToken"),
			userInfo: localStorage.getItem("userInfo"),
		};
	}

	public static removeUserInfo(): void {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userInfo");
	}
}
