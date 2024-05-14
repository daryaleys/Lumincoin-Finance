export type RequestHeadersType = {
	"Content-type": string;
	Accept: string;
	"x-auth-token"?: string;
};

export type RequestParamsType = {
	method: string;
	headers: RequestHeadersType;
	body?: string | null;
};

export type CommonResultType = {
	error: boolean;
	message: string;
	validation?: Array<{
		key: string;
		message: string;
	}>;
	redirect?: string;
};

export type RefreshResultType = {
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
};
