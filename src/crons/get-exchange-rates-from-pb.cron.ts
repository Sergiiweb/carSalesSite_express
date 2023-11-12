import axios from "axios";
import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors/api.error";
import { exchangeRatesRepository } from "../repositories/exchange-rates.repository";

dayjs.extend(utc);

interface IExchangeRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

const handler = async function () {
  try {
    const { data } = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    );

    const rates = data.reduce((acc: any, rate: IExchangeRate) => {
      acc[rate.ccy] = parseFloat(rate.sale);
      return acc;
    }, {});

    await exchangeRatesRepository.create(rates);
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const getExchangeRatesFromPB = new CronJob("*/10 * * * * *", handler);
