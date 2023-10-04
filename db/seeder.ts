import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;
const products: Product[] = [
  {
    name: 'Puma rbd',
    price: 55.95,
    img: 'https://img01.ztat.net/article/spp-media-p1/9efea25f72194651933bfe207b28909c/0558f6ed2596417d8bfb0073491da2b1.jpg',
    brand: 'puma',
    colour: 'White',
    description: 'What a shoe!',
  },
  {
    name: 'Puma infusion',
    price: 49.95,
    img: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1200,h_1200/global/377893/01/sv01/fnd/EEA/fmt/png',
    brand: 'puma',
    colour: 'Black',
    description: 'Good shoes for running',
  },
  {
    name: 'ZAPATILLA 3MC VULC',
    price: 74.95,
    img: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/30763fe1599d438ab4eba89100352700_9366/Zapatilla_3MC_Vulc_Blanco_B22705_01_standard.jpg',
    brand: 'adidas',
    colour: 'Black',
    description: 'Amazing shoes',
  },
  {
    name: 'ZAPATILLA FORUM LOW',
    price: 50.95,
    img: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/09c5ea6df1bd4be6baaaac5e003e7047_9366/Zapatilla_Forum_Low_Blanco_FY7756_01_standard.jpg',
    brand: 'adidas',
    colour: 'Blue and White',
    description: 'To much style',
  },
  {
    name: 'Nike Dunk Low',
    price: 100.95,
    img: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/22beef05-be64-43cd-92a9-6406114a261d/dunk-low-zapatillas-Z1v6wk.png',
    brand: 'nike',
    colour: 'Green',
    description: 'Casual shoes',
  },
  {
    name: 'NIKE AIR JORDAN 1 RETRO LOW BRED TOE',
    price: 80.95,
    img: 'https://it.basketzone.net/zdjecia/2022/05/03/705/51/NIKE_AIR_JORDAN_1_RETRO_LOW_BLACK_TOEs-mini.jpg?mini',
    brand: 'nike',
    colour: 'Black and Red',
    description: 'Good shoes for basket',
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

  //await conn.connection.db.dropDatabase();

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
      {
        product: insertedProducts[2]._id,
        qty: 1,
      },
      {
        product: insertedProducts[3]._id,
        qty: 6,
      },
      {
        product: insertedProducts[4]._id,
        qty: 3,
      },
      {
        product: insertedProducts[5]._id,
        qty: 10,
      },
    ],
    orders: [],
  };
  //const res = await Users.create(user);
  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);