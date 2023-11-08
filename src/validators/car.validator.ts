import joi from "joi";

import { EProducers } from "../enums/producer.enum";

export class CarValidator {
  static model = joi.string().min(1).max(50).trim();
  static year = joi.number().min(1900).max(2023);
  static producer = joi.valid(...Object.values(EProducers));

  static create = joi.object({
    model: this.model.required(),
    year: this.year.required(),
    producer: this.producer.required(),
  });

  static update = joi.object({
    model: this.model,
    year: this.year,
  });
}
