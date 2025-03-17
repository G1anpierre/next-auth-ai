import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend"
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/definitions";
import { getUser } from "./actions/user";
import { html, text } from "./app/login/components/magic-mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: process.env.RESEND_FROM,
      apiKey: process.env.RESEND_API_KEY,
      sendVerificationRequest: async ({ identifier: email, url, provider, theme }) => {
        const redirectUrl = new URL(url)
        redirectUrl.searchParams.set('callbackUrl', '/dashboard')
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Sign in to ${redirectUrl.host}`,
            html: html({ url, host: redirectUrl.host, theme }),
            text: text({ url, host: redirectUrl.host }),
          }),
        })
        if (!res.ok) {
          throw new Error('Failed to send verification request')
        }
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Invalid credentials format');
          return null
        }

        const { email, password } = parsedCredentials.data;

        try {
          const user = await getUser(email);
          
          if (!user?.password) {
            console.log('User not found or no password set');
            return null
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            console.log('Passwords do not match');
            return null
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Failed to authorize user:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Include user.id in session
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return '/dashboard'
    },
  },
});
