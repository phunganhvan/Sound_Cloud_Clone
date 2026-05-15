import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
            _id: string;
            username: string;
            email: string;
            isVerify: boolean;
            type: string;
            role: string;
        }

declare module "next-auth" {
    interface Session {
        address: string;
        access_token?: string;
        refresh_token?: string;
        user: IUser & DefaultSession["user"];
    }
    // interface User {
    //     address: string;
    // }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string;
        refresh_token?: string;
        user: IUser;
    }
}