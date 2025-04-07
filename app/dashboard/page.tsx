import Bento from "@/app/components/bento";
import { urbanist } from "@/app/components/fonts";

const nombres: string[] = ["Andy", "Daniel", "Dael", "Esteban", "Gabriel", "Steph"];
const usuario: string = nombres[Math.floor(Math.random() * nombres.length)];

const obtenerSaludo = (): string => {
  const hora = new Date().getHours();

  if (hora >= 6 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";
  return "Buenas noches";

};

export default function Inicio () {
    return(
        <div>
            <h2 className={`${urbanist.className} text-2xl pl-8 text-[#495057]`}>Hola {usuario}.</h2>
            <h1 className={`${urbanist.className} text-3xl text-[#212529] pl-8`}><strong>{obtenerSaludo()}</strong></h1>
            <div className="flex h-full w-full p-8 "><Bento/></div>
        </div>
        
    )
}