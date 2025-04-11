"use client";
import { usePathname } from "next/navigation";
import ExpedienteCandidato from "@/app/components/expedienteCandidato";

export default function UserInformation() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract the last segment of the path
  return (
    <>
      <ExpedienteCandidato
        userId={"JAT469lLXCZi8wi4dcq9xzNoVSu1"}
        role="candidate"
      />
    </>
  );
}
