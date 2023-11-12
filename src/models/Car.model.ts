import { model, Schema, Types } from "mongoose";

import { ECarBrand, ECarCardRegion, ECarCardStatus, ECurrency } from "../enums";
import { ICar } from "../types/car.type";
import { User } from "./User.model";

const carSchema = new Schema(
  {
    brand: {
      type: String,
      enum: ECarBrand,
    },
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
    currency: {
      type: String,
      enum: ECurrency,
    },
    region: {
      type: String,
      enum: ECarCardRegion,
    },
    status: {
      type: String,
      enum: ECarCardStatus,
      required: true,
      default: ECarCardStatus.inactive,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
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
