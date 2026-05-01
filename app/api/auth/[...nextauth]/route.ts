import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        // Demo auth - in production, verify against your database
        if (!credentials?.email || !credentials?.password) return null;

        // Demo users
        const demoUsers = [
          { id: '1', email: 'demo@netflix.com', password: 'demo123', name: 'Demo User' },
          { id: '2', email: 'admin@netflix.com', password: 'admin123', name: 'Admin User' },
        ];

        const user = demoUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return { id: user.id, email: user.email, name: user.name };
        }

        // Allow signup with any email (demo mode)
        if (credentials.email && credentials.password.length >= 6) {
          return {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.name || credentials.email.split('@')[0],
          };
        }

        return null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
});

export { handler as GET, handler as POST };
