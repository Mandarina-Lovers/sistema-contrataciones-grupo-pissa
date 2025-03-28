import "../globals.css";
import SideBar from "../ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:ml-64 mt-16">
          {children}
        </main>
    </div>
  );
}
