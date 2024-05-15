export type LoginResponseType = {
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
	user: {
		name: string;
		lastName: string;
		id: number;
	};
};

export type RegisterResponseType = {
	user: {
		id: number;
		email: string;
		name: string;
		lastName: string;
	};
};
