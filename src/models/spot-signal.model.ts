import { model, Schema, Document } from 'mongoose';
const schema: Schema = new Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    interval: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    sellPrice: { type: String },
    updateTime: { type: String },
  },
  { timestamps: true },
);
const SpotSignalSchema = model<any & Document>('spotsignals', schema);

export default SpotSignalSchema;
