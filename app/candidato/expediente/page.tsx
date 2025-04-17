import { cookies } from "next/headers";
import ExpedienteCandidato from "@/app/components/expedienteCandidato";

export default async function UserInformation() {
  const candidateCookies = await cookies();
  const userID = candidateCookies.get("candidateId")?.value;
  return (
    <>
      <ExpedienteCandidato
        // userId={"JAT469lLXCZi8wi4dcq9xzNoVSu1"}
        userId={userID}
        role="candidate"
      />
    </>
  );
}
