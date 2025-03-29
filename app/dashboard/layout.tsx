import "../globals.css";
import SideBar from "../ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen flex-1 overflow-hidden bg-gray-100">
        <SideBar />
        <main>
          {children}
        </main>
    </div>
  );
}
