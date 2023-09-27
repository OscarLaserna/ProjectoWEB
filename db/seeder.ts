import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Earthen Bottle',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    brand: 'puma',
    colour: 'green',
    description: 'What a shoe!',
  },
  {
    name: 'Nomad Tumbler',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    brand: 'puma',
    colour: 'green',
    description: 'Yet another item',
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();

  const insertedProducts = await Products.insertMany(products);
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };
  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);