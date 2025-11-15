import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { connectDb } from "./db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDb();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;
        if (user.status === 'suspended') return null;
        const isValid = await bcrypt.compare(credentials?.password || '', user.password);
        if (!isValid) return null;
        if (user.role !== 'owner') return null;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone || '',
          image: user.image || '',
          subscriptionPlan: (user as any).subscriptionPlan || 'basic'
        };
      }
    })
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async session({ session, token }: any) {
      // Ensure name is carried through to the session so UI greetings work
      session.user.name = token.name || session.user.name;
      session.user.role = token.role;
      session.user.id = token.sub;
      session.user.status = token.status;
      session.user.phone = token.phone;
      session.user.image = token.image;
      (session.user as any).subscriptionPlan = token.subscriptionPlan || 'basic';
      return session;
    },
    async jwt({ token, user }: any) {
      // On sign-in, seed token from the authenticated user document
      if (user) {
        token.name = user.name || token.name;
        token.role = user.role;
        token.status = user.status;
        token.phone = user.phone;
        token.image = user.image;
        token.subscriptionPlan = (user as any).subscriptionPlan || 'basic';
      }

      // Always sync latest plan and core fields from DB to avoid stale session data
      try {
        if (mongoose.connection.readyState === 0) {
          await connectDb();
        }
        const dbUser = await User.findOne({ email: token.email }).select('name subscriptionPlan role status phone image').lean();
        if (dbUser) {
          token.name = (dbUser as any).name || token.name;
          token.subscriptionPlan = (dbUser as any).subscriptionPlan || token.subscriptionPlan || 'basic';
          token.role = dbUser.role || token.role;
          token.status = dbUser.status || token.status;
          token.phone = (dbUser as any).phone ?? token.phone;
          token.image = (dbUser as any).image ?? token.image;
        }
      } catch (e) {
        // Swallow errors to avoid breaking auth flow; token remains as-is
      }

      return token;
    }
  },
  pages: {
    signIn: '/signin'
  }
};