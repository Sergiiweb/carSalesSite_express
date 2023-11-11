import joi from "joi";

import { EProducers } from "../enums";

export class CarValidator {
  static model = joi.string().min(1).max(50).trim();
  static description = joi.string().min(20).max(5000).trim();
  static year = joi.number().min(1900).max(2023);
  static price = joi.number().min(1).max(1000000000);
  static producer = joi.valid(...Object.values(EProducers));

  static create = joi.object({
    model: this.model.required(),
    year: this.year.required(),
    producer: this.producer.required(),
    price: this.price.required(),
    description: this.description.required(),
  });

  static update = joi.object({
    model: this.model,
    year: this.year,
    price: this.price,
    description: this.description,
  });
}
