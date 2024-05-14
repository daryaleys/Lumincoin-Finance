export type OperationType = {
	id: number;
	type: string;
	amount: number;
	date: string;
	comment: string;
	category: string;
};

export type OperationsByCategoriesType = {
	[key: string]: number;
};

export type OperationChartDataType = {
	labels: string[];
	datasets: Array<{
		label: string;
		data: number[];
	}>;
};
