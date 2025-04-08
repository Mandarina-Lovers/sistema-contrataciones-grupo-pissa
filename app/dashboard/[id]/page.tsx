"use client"
import { usePathname } from "next/navigation";
import ListInformation from '@/app/components/userinfo'
import Usuarios from '@/app/components/userinfo';
import ExpedienteCandidato from "@/app/components/expedienteCandidato";

export default function UserInformation() {
    const pathname = usePathname();
    const id = pathname.split("/").pop(); // Extract the last segment of the path
return(
    <>
        {/*<ListInformation/>*/}
        <Usuarios/>
        <ExpedienteCandidato userId={id}/>
    </>);

}