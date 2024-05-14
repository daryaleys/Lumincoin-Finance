export type RouteType = {
	route: string;
	filePathTemplate?: string;
	useLayout?: string;
	needAuth?: boolean;
	load(): void;
};
