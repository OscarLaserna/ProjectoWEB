import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import { types } from 'util';
import Orders, { Order } from '@/models/Order';

export interface ProductsResponse {
  products: Product[];
}
export interface ProductsidResponse {
  products: Product[];
}
export interface UserResponse {
  users: User[];
}
export interface CartItemResponse {
  cartItems: User[],
  }
export interface UpdateCartItemResponse {
  cartItems: Types.ObjectId[],
  }
 export interface CreateUserResponse {
  _id: Types.ObjectId | string;
}
export interface CreateOrderResponse {
  _id: Types.ObjectId | string;
}


export async function getProducts(): Promise<ProductsResponse> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
    brand: true,
    colour: true,
    description: true,
  };

  const products = await Products.find({}, productProjection);
  
  return {
    products: products,
  };
}
export async function getProductsid(productId: string): Promise<ProductsidResponse | null> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
    brand: true,
    colour: true,
    description: true,
  };
  const product = await Products.findById(productId, productProjection);

  if (product === null) {
    return null;
  }

  return product;
}

  
export interface CreateUserResponse {
  _id: Types.ObjectId | string;
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}

  export async function getUser(userId: string): Promise<UserResponse | null> {
    await connect();
  
    const userProjection = {
      email: true,
      name: true,
      surname: true,
      address: true,
      birthdate: true,
    };
    const user = await Users.findById(userId, userProjection);
  
    if (user === null) {
      return null;
    }
  
    return user;
  }

  export async function getCart(userId: string
): Promise<CartItemResponse | null> {
    await connect();
    const userProjection = {
      _id:false,
      cartItems:{
        product:true,
        qty:true,
      }
    }
    const productProjection = {
      name:true,
      price:true
    }
    const user = await Users.findById(userId,userProjection).populate('cartItems.product',productProjection);
    
    if (user === null){
      return null
    }
    return user
  }

  export async function createOrder(userId: string, order: {
    address: string;
    cardHolder: string;
    cardNumber: string;
  }): Promise<CreateOrderResponse | null> {
    await connect();
  
    const user = await Users.findById(userId);
    
    if (user === null){
      return null
    }

  
    const doc: Order = {
      ...order,
      date: new Date,
      OrderItems: [],
    };
  
    const newOrder = await Orders.create(doc);
  
    return {
      _id: newOrder._id,
    };
  }


  export async function updateCartItem(
    userId: string,
    productId: string,
    qty: number,
  ): Promise<UpdateCartItemResponse| null> {
    await connect()
    const product = await Products.findById(productId)
    //const productCount = await Products.countDocuments({_id : productId})
   // if (productCount === 0){
    //  return null
    //}
    if (product === null){
      return null
    }

    const user = await Users.findById(userId)

    if (user === null){
      return null
    }
    
    const cartItem = user.cartItems.find((cartItem: any) => cartItem.product._id.equals(productId))

    if (cartItem){
      cartItem.qty = qty
    } else {
      const newCartItem = {
        product: new Types.ObjectId(productId),
        qty: Number,
      }
      user.cartItems.push(newCartItem)
    }

    await user.save()

    const userProjection = {
      _id: false,
      cartItems:{
        product:true,
        qty:true,
      }
    }
    const updateUser = Users
      .findById(userId)

    return updateUser
  }