import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { AuthOptions } from 'next-auth'
export const authOptions: AuthOptions = {
    // config one or more authentication providers
    secret: process.env.NO_SECRET!,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ]
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}