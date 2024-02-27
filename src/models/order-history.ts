import { model, Schema, Document } from 'mongoose';
const schema: Schema = new Schema(
  {
    symbol: { type: String, uppercase: true },
    orderId: { type: String },
    clOrdID: { type: String },
    interval: { type: String },
    body: { type: String },
    side: { type: String },
    orderQty: { type: String },
    ordType: { type: String, default: 'Market' },
    type: { type: String },
    initialAmount: { type: String },
    amount: { type: String },
    status: { type: String },
    clientOrderId: { type: String },
    price: { type: String },
    avgPrice: { type: String },
    origQty: { type: String },
    executedQty: { type: String },
    cumQty: { type: String },
    cumQuote: { type: String },
    timeInForce: { type: String },
    reduceOnly: { type: String },
    closePosition: { type: Boolean },
    positionSide: { type: String },
    stopPrice: { type: String },
    workingType: { type: String },
    priceProtect: { type: Boolean },
    origType: { type: String },
    updateTime: { type: String },
  },
  { timestamps: true },
);
const OrderHistorychema = model<any & Document>('order-history', schema);

export default OrderHistorychema;
