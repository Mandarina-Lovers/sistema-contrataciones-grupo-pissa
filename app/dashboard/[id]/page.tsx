"use client"
import { usePathname } from "next/navigation";
import ListInformation from '@/app/components/usuario-phone'
import Usuarios from '@/app/components/usuario';
import ExpedienteCandidato from "@/app/components/expedienteCandidato";

export default function UserInformation() {
    const pathname = usePathname();
    const id = pathname.split("/").pop(); // Extract the last segment of the path
    return(
        <>
        <div className='hidden md:block'><Usuarios/></div>
        <div className='block md:hidden'><ListInformation/></div>
        <ExpedienteCandidato userId={id}/>
        </>
    );
}