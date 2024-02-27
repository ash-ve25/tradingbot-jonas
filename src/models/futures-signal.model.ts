import { model, Schema, Document } from 'mongoose';
const schema: Schema = new Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    interval: { type: String, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    leverage: { type: Number, required: true },
    type: {type: String, required: true},
    sellPrice: { type: String },
    updateTime: { type: String },
  },
  { timestamps: true },
);
const FuturesSignalSchema = model<any & Document>('futuressignals', schema);

export default FuturesSignalSchema;
