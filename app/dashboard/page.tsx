<<<<<<< HEAD
export default function Home() {
    return(
      <div>
        <strong>Dashboard</strong>
      </div>
    )
  }
=======
import ListUsers from "../components/listusers";
import CountUsers from "../components/countusers";

export default async function Dashboard() {
  
  return (
    <div className="flex-1 overflow-y-auto p-4 mt-16 md:mt-0">
      <CountUsers></CountUsers>
      <ListUsers></ListUsers>
    </div>
  );
}
>>>>>>> admin-dashboard
