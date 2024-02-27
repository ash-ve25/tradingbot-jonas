import { Admin } from '@/interface/admin.interface';
import { model, Schema, Document } from 'mongoose';
const adminSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const AdminSchema = model<Admin & Document>('admin', adminSchema);

export default AdminSchema;
