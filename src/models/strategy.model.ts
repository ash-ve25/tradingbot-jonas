import { model, Schema, Document } from 'mongoose';
const schema: Schema = new Schema(
  {
    percentage: { type: String, required: true, uppercase: true, trim: true },
    interval: { type: String, required: true },
  },
  { timestamps: true },
);
const TradingAmountchema = model<any & Document>('strategy', schema);

export default TradingAmountchema;
