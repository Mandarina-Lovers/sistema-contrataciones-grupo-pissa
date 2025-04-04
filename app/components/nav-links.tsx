import { Bolt, KeyRound, User, Users, House } from "lucide-react";
import Link from 'next/link';
  
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: 'Inicio', href: '/dashboard/inicio', icon: House},
    { name: 'Candidatos', href: '/dashboard', icon: Users },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Bolt },
    { name: 'Credenciales', href: '/dashboard/credenciales', icon: KeyRound },
    { name: 'Perfil', href: '/dashboard/perfil', icon: User}
];
  
export default function NavLinks() {
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex h-[48px] grow items-center justify-center gap-2 p-3 md:ml-4 md:mr-4 rounded-xl text-sm font-medium hover:bg-[#42b883] hover:text-[#e6f2f8] md:flex-none md:justify-start md:p-2 md:px-3 text-[#e9ecef]">
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}