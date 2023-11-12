import { Router } from "express";

import { carController } from "../controllers/car.controller";
import {EUserAccountType, EUserRoles} from "../enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { carMiddleware } from "../middlewares/car.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(5, "createdAt"),
  carController.getAll,
);

router.post(
  "/",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.createCar,
);

router.get(
  "/car-cards-moderation",
  authMiddleware.checkRole([EUserRoles.Administrator, EUserRoles.Manager]),
  authMiddleware.checkAccessToken,
  commonMiddleware.isQueryValid(5, "createdAt"),
  carController.getAllInactiveCars,
);

router.get(
  "/statistics/:carId",
  authMiddleware.checkAccountType(EUserAccountType.Premium),
  commonMiddleware.isIdValid("carId"),
  authMiddleware.checkAccessToken,
  carController.getStatistics,
);

router.get(
  "/:carId",
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);

router.put(
  "/:carId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateCar,
);

router.delete(
  "/:carId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("carId"),
  carController.deleteCar,
);

export const carRouter = router;
