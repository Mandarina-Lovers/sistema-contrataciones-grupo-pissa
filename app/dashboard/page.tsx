import ListUsers from "../ui/listusers";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-4 mt-16 md:mt-0">
      <ListUsers></ListUsers>
    </div>
  );
}
