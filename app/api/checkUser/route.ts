import { NextRequest, NextResponse } from "next/server";
import { database } from "../../../firebaseConfig";
import { ref, get } from "firebase/database";

export async function POST(request: NextRequest) {
  try {
    // Extraer el userId del header de la solicitud
    const userIdHeader = request.headers.get("X-UserId") || "";
    const userId = userIdHeader.trim();

    if (!userId) {
      return NextResponse.json({ blocked: true }, { status: 401 });
    }

    // Obtener los datos del usuario desde Firebase
    const snapshot = await get(ref(database, `usuarios/${userId}`));
    if (!snapshot.exists()) {
      return NextResponse.json({ blocked: true }, { status: 404 });
    }

    const { estadoUsuario } = snapshot.val() || {};

    // Si estadoUsuario == "bloqueado", return { blocked: true } else return { blocked: false }
    return NextResponse.json({
      blocked: estadoUsuario === "bloqueado",
    });
  } catch (error) {
    console.error("Error checking user state:", error);
    return NextResponse.json({ blocked: true }, { status: 500 });
  }
}