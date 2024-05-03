export class UserInfo {
    static setUserInfo(accessToken = "", refreshToken = "", id = "", name = "", lastName = "") {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify({id: id, name: name, lastName: lastName}));
    }

    static getUserInfo() {
        return {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken'),
            userInfo: localStorage.getItem('userInfo')
        }
    }

    static removeUserInfo() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
    }
}