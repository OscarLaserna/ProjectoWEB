import { NextAuthOptions, User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, CreateUserResponse, getProductsid, getUser, updateCartItem, UpdateCartItemResponse } from '@/lib/handlers';
import { userAgent } from 'next/server';
import { findSourceMap } from 'module';
import { connect } from 'http2';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'E-mail address',
          type: 'email',
          placeholder: 'jsmith@jsmith.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        // Check credentials here...
        if(!credentials?.email||credentials.password){
            return null;
        }
        const user == await Users.findOne({email: credentials.email});

        if (user === null){
            return null;
        }

        if (user.password !== credentials.password){
            return null;
        }

        return { _id: "user" } as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
  },
};