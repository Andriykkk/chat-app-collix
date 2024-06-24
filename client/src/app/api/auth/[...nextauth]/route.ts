import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "@/lib/auth";

export const OPTIONS = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          !credentials?.password ||
          !credentials?.password
        )
          return null;

        try {
          const user = signIn(
            credentials.email,
            credentials.password
          );
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
};

export const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
