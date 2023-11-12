import { FilterQuery } from "mongoose";

import { ECarCardStatus } from "../enums";
import { Car } from "../models/Car.model";
import { Statistics } from "../models/Statistics.model";
import { ICar, IQuery, IStatistics } from "../types";

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
    const car = await Car.create({ ...dto, _userId: userId });

    await this.createStatistic(car._id);

    return car;
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

  public async getStatistic(carId: string): Promise<IStatistics> {
    return await Statistics.findOne({ _carId: carId });
  }

  public async createStatistic(carId: string): Promise<void> {
    await Statistics.create({ _carId: carId });
  }

  public async addView(carId: string, dto: IStatistics): Promise<void> {
    await Statistics.updateOne({ _carId: carId }, dto);
  }
}

export const carRepository = new CarRepository();
