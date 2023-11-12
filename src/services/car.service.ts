import { regexConstants } from "../constants/regex.constants";
import {
  ECarCardStatus,
  EEmailAction,
  EUserAccountType,
  EUserRoles,
} from "../enums";
import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { userRepository } from "../repositories/user.repository";
import { ICar, IPaginationResponse, IQuery, IStatistics } from "../types";
import { emailService } from "./email.service";

class CarService {
  public async getAll(): Promise<ICar[]> {
    return await carRepository.getAll();
  }

  public async getAllWithPagination(
    query: IQuery,
  ): Promise<IPaginationResponse<ICar>> {
    try {
      const [cars, itemsFound] = await carRepository.getMany(query);

      return {
        page: +query.page,
        limit: +query.limit,
        itemsFound,
        data: cars,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async createCar(
    dto: ICar,
    userId: string,
    accountType: string,
  ): Promise<ICar> {
    await Promise.all([
      this.checkAbilityToCreate(userId, accountType),
      this.checkForBadWords(dto),
    ]);

    return await carRepository.createCar(dto, userId);
  }

  public async updateCar(
    carId: string,
    dto: Partial<ICar>,
    userId: string,
    role: string,
  ): Promise<ICar> {
    await this.checkAbilityToManage(userId, carId, role);
    return await carRepository.updateCar(carId, dto);
  }

  public async deleteCar(
    carId: string,
    userId: string,
    role: string,
  ): Promise<void> {
    await this.checkAbilityToManage(userId, carId, role);
    await carRepository.deleteCar(carId);
  }

  public async getAllInactiveCarsWithPagination(
    query: IQuery,
  ): Promise<IPaginationResponse<ICar>> {
    try {
      const [cars, itemsFound] = await carRepository.getAllInactiveCars(query);

      return {
        page: +query.page,
        limit: +query.limit,
        itemsFound,
        data: cars,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getStatistics(carId: string): Promise<IStatistics> {
    try {
      return await carRepository.getStatistic(carId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async addViews(carId: string): Promise<any> {
    try {
      const stat = await carRepository.getStatistic(carId);
      stat.views += 1;
      stat.views_per_day += 1;
      stat.views_per_week += 1;
      stat.views_per_month += 1;
      return await carRepository.addView(carId, stat);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  private async checkAbilityToManage(
    userId: string,
    manageCarId: string,
    role: string,
  ): Promise<ICar> {
    const car = await carRepository.getOneByParams({
      _userId: userId,
      _id: manageCarId,
    });

    if (!car && role !== (EUserRoles.Administrator || EUserRoles.Manager)) {
      throw new ApiError("You can not manage this car", 403);
    }

    return car;
  }

  private async checkAbilityToCreate(
    userId: string,
    accountType: string,
  ): Promise<void> {
    const userCar = await carRepository.getOneByParams({ _userId: userId });
    if (userCar && accountType === EUserAccountType.Base) {
      throw new ApiError(
        "You can not add any more cars. Buy premium account.",
        403,
      );
    }
  }

  private async checkForBadWords(dto: ICar): Promise<void> {
    const checkForBadWords = dto.description.match(regexConstants.DESCRIPTION);
    if (!checkForBadWords) {
      dto.status = ECarCardStatus.active;
    } else {
      const moderator = await userRepository.getOneByParams({
        role: EUserRoles.Manager,
      });
      await emailService.sendMail(
        moderator.email,
        EEmailAction.MODERATE_CAR_CARD,
        {
          name: moderator.name,
          id: dto._id,
        },
      );
    }
  }
}

export const carService = new CarService();
