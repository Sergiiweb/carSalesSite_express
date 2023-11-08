import { model, Schema, Types } from "mongoose";

import { EProducers } from "../enums/producer.enum";
import { ICar } from "../types/car.type";
import { User } from "./User.model";

const carSchema = new Schema(
  {
    model: {
      type: String,
    },
    year: {
      type: Number,
      min: [1900, "Minimum age is 1900"],
      max: [new Date().getFullYear(), "Maximum age is 2023"],
    },
    producer: {
      type: String,
      enum: EProducers,
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
