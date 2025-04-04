import "../globals.css";
import SideNav from "../components/sidenav";
import { urbanist } from '@/app/components/fonts';

const nombres: string[] = ["Andy", "Daniel", "Dael", "Esteban", "Gabriel", "Steph"];
const usuario: string = nombres[Math.floor(Math.random() * nombres.length)];

const obtenerSaludo = (): string => {
  const hora = new Date().getHours();

  if (hora >= 6 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";
  return "Buenas noches";

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 pl-2 bg-gray-50">
        <SideNav/>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-gray-50">
        <h2 className={`${urbanist.className} text-2xl pl-8 text-[#495057]`}>Hola {usuario}.</h2>
        <h1 className={`${urbanist.className} text-3xl text-[#212529] pl-8`}><strong>{obtenerSaludo()}</strong></h1>
        {children}
      </div>
    </div>
  );
}
