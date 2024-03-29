import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { ObjectId, Types } from 'mongoose';
import { types } from 'util';
import Orders, { Order } from '@/models/Order';
import bcrypt from 'bcrypt';
import { Type } from 'typescript';

export interface ProductsResponse {
  products: Product[];
}
export interface ProductsidResponse {
  products: Product[];
  // hay que hacer esto para que no salte error, quitar y mirar que pasa en src/app/(sections)/products/[productId]/page.tsx
  // TODO: si se cambia el map() poniendo :any no salta el error, preguntar a gabriel
  name : string;
  description : string;
  img : string;
  price : number;
}
export interface UserResponse {
  users: User[];
  name : string;
  surname : string;
  email: string;
  address : string;
  birthday: Date;
  orders:Types.ObjectId[];
}
export interface CartItemResponse {
  //cambio pq solo como User[] lo detectaba mal
  // TODO: si se cambia el map() poniendo :any no salta el error, preguntar a gabriel
  cartItems: User['cartItems'],
}
export interface OrderResponse {
  Order: User[];
  cardHolder:string;
  _id: Types.ObjectId | String;
  address: String;
  cardNumber:String;
  date: Date;
  OrderItems: Order['OrderItems'],
}
export interface UpdateCartItemResponse {
  cartItems: User['cartItems'],
  created: boolean;
}
 export interface CreateUserResponse {
  _id: Types.ObjectId | string;
}
export interface CreateOrderResponse {
  _id: Types.ObjectId[];
}
export interface RemoveProductResponse{
  cartItems: User['cartItems'],
}


export async function getProducts(): Promise<ProductsResponse> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
    brand: true,
    colour: true,
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

  const hash = await bcrypt.hash(user.password, 10);
  const doc: User = {
    ...user,
    password: hash,
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

  export async function getOrder(userId: string
    ): Promise<OrderResponse | null> {
        await connect();
        const userProjection = {
          _id:false,
          orders:true,
        }
        const orderProjection = {
          date: true,
          address: true,
          cardHolder: true,
          cardNumber: true,
        }
        const user = await Users.findOne({_id:userId},userProjection).populate('orders',orderProjection);
        
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

    const productProjection = {
      price:true
    }
  
    const user = await Users.findById(userId).populate('cartItems.product',productProjection);
    //const product.idd = user.
    //const product = await Products.findById(userId);
    if (user === null){
      return null
    }

  
    const doc: Order = {
      ...order,
      date: new Date,
      //OrderItems: [],
      OrderItems: user.cartItems.map((cartItem: any)=>({
        ...cartItem,
        price: cartItem.product.price,
      })),
    };
  
    const newOrder = await Orders.create(doc);
    user.cartItems = [];

     user.orders.push(newOrder._id)
     //newOrder.OrderItems.push(user.cartItem)
     //newOrder.OrderItems.price.push(user.cartItem)
     await user.save()
    return {
      _id: newOrder._id,
    };
  }


  export async function updateCartItem(
    userId:string,
    productId:string,
    qty:number,
  ):Promise<UpdateCartItemResponse | null>{
    await connect();
    var created;
  
    const product = await Products.findById(productId);
    if(product === null) return null;
  
    const user = await Users.findById(userId);
    if(user === null) return null;
  
    const cartItem = user.cartItems.find(
      (cartItem: any) => cartItem.product._id.equals(productId)
    );
  
    if(cartItem){
      cartItem.qty = qty;
      created = false;
    }else{
      const newCartItem = {
        product: new Types.ObjectId(productId),
        qty: qty,
      }
      user.cartItems.push(newCartItem);
      created = true;
    }
  
    await user.save();
  
    const userProjection = {
      _id: false,
      cartItems: true,
    }
  
    const productProjection = {
      name: true,
      price: true,
    }
  
    const updateUser = await Users.findById(userId, userProjection)
      .populate("cartItems.product", productProjection);
  
    const output = {
      cartItems: updateUser,
      created: created,
    }
    return output;
  }

  export async function getOrderById(userId:string, orderId:string):Promise<OrderResponse | null>{
    await connect();
    const orderProjection = {
      _id: true,
      date: true,
      address: true,
      cardHolder: true,
      cardNumber: true,
      OrderItems:{
        product: true,
        qty: true,
        price:true,
      }
    }
    const productProjection = {
      name:true,
    }
    const userProjection = {
      _id: false,
      orders:true,
    }
  
    const user = await Users.findById(userId,userProjection).populate('orders',orderProjection);
  
    if(!user){
      return null;
    }
  
    var order = user.orders.find(
      (orderItem:any) => orderItem._id.equals(orderId)
    );
  
    if(!order){
      return null;
    }
    order = order.populate('OrderItems.product',productProjection);
    // SINO la encuentra como va a popularizar el order
    return order;
  }

  export async function removeProduct(userId:string, productId:string) 
:Promise<RemoveProductResponse | null>{
  await connect();
  
  const product = await Products.findById(productId);
  if(product === null) return null;

  const user = await Users.findById(userId);
  if(user === null) return null;

  const productFound = user.cartItems.find(
    (cartItem: any) => cartItem.product._id.equals(productId)
  );
  const userProjection = {
    _id: false,
    cartItems: true,
  }

  const productProjection = {
    _id:true,
    name:true,
    price:true,
  }

  if(productFound){
    const cart = user.cartItems.filter((item:any) => item != productFound);
    user.cartItems = cart;
  }else{
    const NPIcartItem = await Users.findById(userId, userProjection)
    .populate("cartItems.product", productProjection);
    return NPIcartItem;
  }

  await user.save();
  

  const updateUser = await Users.findById(userId, userProjection)
    .populate("cartItems.product", productProjection);
  
  return updateUser;
  
}