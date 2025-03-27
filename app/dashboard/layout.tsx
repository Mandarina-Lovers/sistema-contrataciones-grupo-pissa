import "../globals.css";
import TopBar from "../ui/topbar";
import SideBar from "../ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 bg-gray-100 p-4">{children}</main>
      </div>
    </div>
  );
}
