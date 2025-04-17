'use client';

import { Bolt, KeyRound, User, Users, House, Archive, Handshake} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ para App Router

const linksRH = [
  { name: 'Inicio', href: '/dashboard', icon: House },
  { name: 'Personas', href: '/dashboard/personas', icon: Users },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Bolt },
  { name: 'Credenciales', href: '/dashboard/credenciales', icon: KeyRound },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User }
];

const linksCandidato = [
  { name: 'Inicio', href: '/candidato', icon: House },
  { name: 'Expediente', href: '/candidato/expediente', icon: Archive },
  { name: 'Onboarding', href: '/candidato/onboarding', icon: Handshake},
  { name: 'Configuración', href: '/candidato/configuracion', icon: Bolt },
  { name: 'Perfil', href: '/candidato/perfil', icon: User }
];

export default function NavLinks({ roleView }: { roleView: string }) {
  const pathname = usePathname(); // ✅ obtiene la ruta actual
  const links = roleView === "RH" ? linksRH : linksCandidato;
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] md:grow p-3 ml-2 mr-2 items-center justify-center gap-2 md:ml-4 md:mr-4 md:mb-1 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3
              ${isActive
                ? 'bg-[#2975a0] text-[#e6f2f8] md:rounded-xl rounded-full'
                : 'text-[#e9ecef] hover:bg-[#2974a04b] hover:text-[#e6f2f8] rounded-xl'}`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}