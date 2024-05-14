export type CommonUserInfoType = {
	accessToken: string | null;
	refreshToken: string | null;
	userInfo: string | null;
};

export type UserInfoType = {
	id: number;
	name: string;
	lastName: string;
};
