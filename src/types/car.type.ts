import { Document } from "mongoose";

import { ECarCardStatus, EProducers } from "../enums";

export interface ICar extends Document {
  model?: string;
  year?: number;
  producer?: EProducers;
  price?: number;
  description?: string;
  status: ECarCardStatus;
}
