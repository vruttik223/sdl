import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  if (request.cookies.has('maintenance') && path !== '/maintenance') {
    let myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${request.cookies.get('uat')?.value}`
    );
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    
    // Construct absolute URL from the request origin for middleware
    const origin = request.nextUrl.origin;
    let data = await (
      await fetch(`${origin}/api/settings`, requestOptions)
    )?.json();

    if (data?.values?.maintenance?.maintenance_mode && path !== '/maintenance') {
      return NextResponse.redirect(new URL(`/maintenance`, request.url));
    } else {
      if (request.cookies.get('maintenance')) {
        return NextResponse.next();
      } else {
        const response = NextResponse.next();
        response.cookies.delete('maintenance');
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
