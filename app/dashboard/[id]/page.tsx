import UserInfo from "@/app/components/userinfo";
export default async function UserInformation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <UserInfo id={id} />
    </div>
  );
}
