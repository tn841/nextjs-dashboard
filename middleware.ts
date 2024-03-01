import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}


/*
 - middleware.ts 파일을 프로젝르 루트에 생성한다.
 - nextjs 서버에서 request를 처리할 때, middleware를 먼저 처리한다.
 - middleware가 동작하기 원하는 URL패턴을 matcher로 설정 할 수 있다.
 - 이 예제에서는
*/