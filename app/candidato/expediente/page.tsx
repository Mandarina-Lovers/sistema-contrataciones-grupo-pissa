"use client"
import { usePathname } from "next/navigation";
import ExpedienteCandidato from "@/app/components/expedienteCandidato";

export default function UserInformation() {
    const pathname = usePathname();
    const id = pathname.split("/").pop(); // Extract the last segment of the path
    return(
        <>
        <ExpedienteCandidato userId={'B7eXqDrAYVeHQ9dVAwb5hcAzd872'} role='candidate'/>
        </>
    );
}