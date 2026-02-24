import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = (process.env.AUTH_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email || !allowedEmails.includes(email)) {
        return "/login?error=unauthorized";
      }
      return true;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
