import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Uso las cookies para obtener el userId del usuario logueado (porque así le hizo Daniel
  // pero podemos cambarlo a otro método si es necesario)
  const userId = request.cookies.get("candidateId");
  if (!userId) {
    // Si no hay userId, redirigir a la página de inicio
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Llama a la ruta de la API para verificar el estado del usuario (esto porque middleware
  // no puede acceder a Firebase directamente)
  const res = await fetch(`${request.nextUrl.origin}/api/checkUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-UserId": userId.value,
    },
  });
  
  // Si la llamada a la API falló, redirigir a la página de inicio
  if (!res.ok) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si el usuario está bloqueado, redirigir a la página de bloqueado
  const data = await res.json();
  if (data.blocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }
  return NextResponse.next();
}

// Paths que debemos proteger con el middleware
export const config = {
  matcher: ["/dashboard/:path*", "/expediente-candidatos/:path*"],
};