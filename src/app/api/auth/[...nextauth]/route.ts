import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { sendRequest } from '@/utils/api'
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWTOptions } from 'next-auth/jwt'
export const authOptions: AuthOptions = {
    // config one or more authentication providers
    secret: process.env.NO_SECRET!,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await sendRequest<IBackendRes<JWT>>(
                    {
                        url: "http://localhost:8000/api/v1/auth/login",
                        method: "POST",
                        body: {
                            username: credentials?.username,
                            password: credentials?.password,
                        }
                    }
                );
                if (res && res.data) {
                    return res.data as any;
                }
                else {
                    return null;
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider !== "credentials") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/social-media",
                    method: "POST",
                    body: {
                        type: account?.provider?.toUpperCase(),
                        username: user?.email,
                    }

                });
                if (res && res.data) {
                    token.access_token = res.data.access_token;
                    token.refresh_token = res.data.refresh_token;
                    token.user = res.data.user;
                }
            } else if (trigger === "signIn" && account?.provider === "credentials") {
                //local data
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.user = user.user;

            }
            return token;
        },
        session({ session, token, user }) {
            if (token) {
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user;
            }
            return session;
        }
    }
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }