import Image from 'next/image';
import NavLinks from './nav-links';
import { LogOut } from 'lucide-react';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-21">     
        <div className="h-auto w-full grow rounded-xl bg-[#0d324f] md:block flex flex-row">
          <div className="w-full flex items-center md:pl-4 md:pt-4 md:pr-8 md:pb-8 pl-4">
            <Image
              width={100}
              height={50}
              alt="Logo de Grupo Pissa"
              src="/logo-blanco.png"
            />
          </div>
          <NavLinks />
        </div>
      </div>
    </div>
  );
}