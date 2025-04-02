<<<<<<< HEAD
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="es">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
=======
import "../globals.css";
import SideBar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen flex-1 overflow-hidden bg-gray-100">
        <SideBar />
        <main className="md:ml-64">
          {children}
        </main>
    </div>
  );
}
>>>>>>> admin-dashboard
