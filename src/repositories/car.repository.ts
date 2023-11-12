import { FilterQuery } from "mongoose";

import { ECarCardStatus } from "../enums";
import { Car } from "../models/Car.model";
import { ICar, IQuery } from "../types";

class CarRepository {
  public async getAll(): Promise<ICar[]> {
    return await Car.find({ status: ECarCardStatus.active }).populate(
      "_userId",
      ["name", "phone"],
    );
  }

  public async getMany(query: IQuery): Promise<[ICar[], number]> {
    const queryStr = JSON.stringify(query);
    const queryObj = JSON.parse(
      queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
    );

    const { page, limit, sortedBy, ...searchObject } = queryObj;
    searchObject.status = ECarCardStatus.active;

    const skip = +limit * (+page - 1);

    return await Promise.all([
      Car.find(searchObject)
        .limit(+limit)
        .skip(skip)
        .sort(sortedBy)
        .populate("_userId", ["name", "phone"]),
      Car.count(searchObject),
    ]);
  }

  public async getOneByParams(params: FilterQuery<ICar>): Promise<ICar> {
    return await Car.findOne(params);
  }

  public async findById(id: string): Promise<ICar> {
    return await Car.findById(id);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    return await Car.create({ ...dto, _userId: userId });
  }

  public async updateCar(carId: string, dto: Partial<ICar>): Promise<ICar> {
    return await Car.findByIdAndUpdate(carId, dto, {
      returnDocument: "after",
    }).populate("_userId");
  }

  public async deleteCar(carId: string): Promise<void> {
    await Car.deleteOne({ _id: carId });
  }

  public async getAllInactiveCars(query: IQuery): Promise<[ICar[], number]> {
    const queryStr = JSON.stringify(query);
    const queryObj = JSON.parse(
      queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
    );

    const { page, limit, sortedBy, ...searchObject } = queryObj;
    searchObject.status = ECarCardStatus.inactive;

    const skip = +limit * (+page - 1);

    return await Promise.all([
      Car.find(searchObject)
        .limit(+limit)
        .skip(skip)
        .sort(sortedBy)
        .populate("_userId", ["name", "phone"]),
      Car.count(searchObject),
    ]);
  }
}

export const carRepository = new CarRepository();
