"use client";
import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="w-64 bg-(--pissa-blue) text-white p-4">
      <ul className="mt-4 space-y-2">
        <Link href="/dashboard">
          <li className="hover:bg-(--pissa-secondary-blue) p-2 rounded">
            Candidatos
          </li>
        </Link>
        <Link href="/dashboard/settings">
          <li className="hover:bg-(--pissa-secondary-blue) p-2 rounded">
            Configuración
          </li>
        </Link>
        <Link href="/dashboard/profile">
          <li className="hover:bg-(--pissa-secondary-blue) p-2 rounded">
            Perfil
          </li>
        </Link>
      </ul>
    </aside>
  );
}
