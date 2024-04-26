export class IncomeAndExpenses {
    constructor() {
        console.log('income-and-expenses')

            $('#startDate').datepicker({
                "format": "mm.dd.yy",
                // "language": 'ru',
                "locale": 'ru'
            }); 
    }
}