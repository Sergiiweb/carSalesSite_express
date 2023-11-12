import { NextFunction, Request, Response } from "express";

import { carRepository } from "../repositories/car.repository";
import { carService } from "../services/car.service";
import { ICar, IQuery, ITokenPayload } from "../types";
import { IStatistics } from "../types/statistics.type";

class CarController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
    try {
      const cars = await carService.getAllWithPagination(req.query as IQuery);

      return res.json(cars);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const car = req.res.locals;

      await carService.addViews(car._id);

      res.json(car);
    } catch (e) {
      next(e);
    }
  }

  public async createCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, accountType } = req.res.locals
        .tokenPayload as ITokenPayload;

      const car = await carService.createCar(req.body, userId, accountType);

      res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }
  public async updateCar(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.res.locals.tokenPayload as ITokenPayload;

      const car = await carService.updateCar(
        req.params.carId,
        req.body,
        userId,
        role,
      );

      res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }

  public async deleteCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, role } = req.res.locals.tokenPayload as ITokenPayload;

      await carService.deleteCar(req.params.carId, userId, role);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async getAllInactiveCars(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
    try {
      const cars = await carService.getAllInactiveCarsWithPagination(
        req.query as IQuery,
      );

      return res.json(cars);
    } catch (e) {
      next(e);
    }
  }

  public async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IStatistics>> {
    try {
      const statistics = await carService.getStatistics(req.params.carId);

      return res.json(statistics);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();
