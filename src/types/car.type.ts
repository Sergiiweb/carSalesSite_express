import { Document } from "mongoose";

import { EProducers } from "../enums/producer.enum";

export interface ICar extends Document {
  model?: string;
  year?: number;
  producer?: EProducers;
}
