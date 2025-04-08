import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

  if(request.nextUrl.pathname === "/auth/redirector") {
  // 1. Leer cookie "candidateId"
    const userId = request.cookies.get("candidateId");

    if (!userId) {
      // Si no hay cookie, redirigir al inicio
      return NextResponse.redirect(new URL("/blocked", request.url));
    }

    // 2. Validar al usuario desde /api/checkUser
    const checkUserRes = await fetch(`${request.nextUrl.origin}/api/checkUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-UserId": userId.value,
      },
    });

    if (!checkUserRes.ok) {
      // Algo salió mal, redirige al inicio
      return NextResponse.redirect(new URL("/blocked", request.url));
    }

    const { blocked, role } = await checkUserRes.json();

    // 3. Si está bloqueado → /blocked
    if (blocked) {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }

    if (role === "candidato") {
      return NextResponse.redirect(new URL("/dashboard-candidato/expediente", request.url));
    }
    if (role === "rh") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Si no está bloqueado y ya está en la ruta correcta, permitir
    return NextResponse.redirect(new URL("/blocked", request.url));
  }
}

// Ajusta las rutas que deseas proteger
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/dashboard-candidato",
    "/dashboard-candidato/:path*",
    "/blocked",
    "/auth/redirector"
  ],
};