import { model, Schema, Document } from 'mongoose';
const schema: Schema = new Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    interval: { type: String, required: true },
    amount: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const TradingAmountchema = model<any & Document>('tradingpair', schema);

export default TradingAmountchema;
