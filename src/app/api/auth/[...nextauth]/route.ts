import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { sendRequest } from '@/utils/api'
export const authOptions: AuthOptions = {
    // config one or more authentication providers
    secret: process.env.NO_SECRET!,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider === "github") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/social-media",
                    method: "POST",
                    body: {
                        type: "GITHUB",
                    }

                });
                if(res && res.data){
                    token.access_token = res.data.access_token;
                    token.refresh_token = res.data.refresh_token;
                    token.user = res.data.user;
                }
            };
            return token;
        },
        session({ session, token, user }) {
            if(token){
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