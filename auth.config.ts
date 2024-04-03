import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log('auth.config.ts >> isLoggedIn : ', isLoggedIn);
      console.log('auth.config.ts >> isOnDashboard : ', isOnDashboard);
      console.log('auth.config.ts >> nextUrl : ', nextUrl);
      console.log('auth.config.ts >> process.env.NEXTAUTH_URL : ', process.env.NEXTAUTH_URL);
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', process.env.NEXTAUTH_URL));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;