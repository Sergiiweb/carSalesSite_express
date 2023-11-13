import { configs } from "../configs/config";
import { ICar } from "../types";

interface IPresenter<I, O> {
  present(payload: I): O;
}

class CarPresenter implements IPresenter<ICar, Partial<ICar>> {
  present(data: ICar): Partial<ICar> {
    return {
      _id: data._id,
      brand: data.brand,
      model: data.model,
      description: data.description,
      region: data.region,
      year: data.year,
      price: data.price,
      currency: data.currency,
      status: data.status,
      photo: `${configs.AWS_S3_URL}/${data.photo}`,
    };
  }
}

export const carPresenter = new CarPresenter();
