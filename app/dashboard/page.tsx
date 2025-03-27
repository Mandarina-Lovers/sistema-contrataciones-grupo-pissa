import SideBar from "../ui/sidebar";
import TopBar from "../ui/topbar";
import MainDisplay from "../ui/maindisplay";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <SideBar></SideBar>
      <div className="flex flex-col flex-1">
        <TopBar></TopBar>
        <MainDisplay></MainDisplay>
      </div>
    </div>
  );
}