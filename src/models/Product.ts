import mongoose, { Schema, Types } from 'mongoose';

export interface Product {
    _id?: Types.ObjectId;
    name: string;
    brand: string;
    colour: string;
    price: number;
    img: string;
    description: string;

  }
  const ProductSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    }
  );
  
  export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

  