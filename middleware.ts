import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  /*
  // 1. Leer cookie "candidateId" (httpOnly, accesible desde el servidor)
  const userId = request.cookies.get("candidateId");

  if (!userId) {
    // Si no hay cookie, redirigir al inicio de sesión
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Validar al usuario desde un endpoint propio (por ejemplo: verificar si existe, está activo, etc.)
  const res = await fetch(`${request.nextUrl.origin}/api/checkUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-UserId": userId.value,
    },
  });

  if (!res.ok) {
    // Algo salió mal, redirige al inicio
    return NextResponse.redirect(new URL("/", request.url));
  }

  const data = await res.json();

  // 3. Redirigir si el usuario está bloqueado o no tiene acceso
  if (data.blocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // 4. Si todo bien, seguir con la petición
  return NextResponse.next();
}

export const config = {
  matcher: [
    //"/dashboard",
    //"/dashboard/:path*",
    "/expediente-candidatos",
    "/expediente-candidatos/:path*"
  ],
  */
};
