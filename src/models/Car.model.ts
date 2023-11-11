import { model, Schema, Types } from "mongoose";

import { ECarCardStatus, EProducers } from "../enums";
import { ICar } from "../types/car.type";
import { User } from "./User.model";

const carSchema = new Schema(
  {
    model: {
      type: String,
    },
    description: {
      type: String,
    },
    year: {
      type: Number,
      min: [1900, "Minimum age is 1900"],
      max: [
        new Date().getFullYear(),
        `Maximum age is ${new Date().getFullYear()}`,
      ],
    },
    price: {
      type: Number,
      min: [1, "Minimum price is 1"],
      max: [1000000000, `Maximum price is 1000000000}`],
    },
    producer: {
      type: String,
      enum: EProducers,
    },
    status: {
      type: String,
      enum: ECarCardStatus,
      required: true,
      default: ECarCardStatus.inactive,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>("car", carSchema);
