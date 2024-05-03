import { Requests } from "../../helpers/requests";

export class Operations {
  constructor() {
    console.log("income-and-expenses");

    $("#startDate").datepicker({
      format: "mm.dd.yy",
      // "language": 'ru',
      locale: "ru",
    });

    this.getOperations().then();
  }

  async getOperations() {
    const result = await Requests.request("/operations", "GET", true);

    if (result.redirect) {
      this.openNewRoute(result.redirect);
    }

    if (result.error) {
      return alert(
        "Возникла ошибка при запросе операций. Пожалуйста, обратитесь в поддержку"
      );
    }

    console.log(result);
  }
}
