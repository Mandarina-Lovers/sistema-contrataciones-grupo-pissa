import FormularioOlvide from "../components/form-olvide"
import Image from 'next/image';
import { urbanist } from '@/app/components/fonts';
import FondoBlanco from "../components/fondo-blanco";

export default function Olvidaste () {
    return(
        <div className="bg-[#2d4583] md:bg-white h-screen p-8 md:justify-around md:flex">
            <div className="md:justify-center md:items-center md:flex md:absolute">
                <Image
                    width={50}
                    height={50}
                    alt="Logo Pissa"
                    src="/icono-blanco.png"
                    className="pb-10 block md:hidden"
                />
            </div>
            <div className="block md:hidden">
                <FondoBlanco>
                    <h1 className={`text-[#001e2b] text-center text-2xl md:text-3xl pb-4 ${urbanist.className}`}><strong>Cambiar contraseña</strong></h1>
                    <p className="text-[#001e2b] text-center antialiased pb-8">Ingresa tu correo, tu nueva contraseña y manda tu solicitud.</p>
                    <FormularioOlvide></FormularioOlvide>
                </FondoBlanco>
            </div>
            <div className="hidden md:flex md:justify-center md:items-center w-1/2 flex-col">
                <div className="md:justify-around md:m-40">
                    <Image
                        width={150}
                        height={100}
                        alt="Logo Pissa"
                        src="/logo_pissa.png"
                        className="pb-10 hidden md:block"
                    />
                    <h1 className={`text-[#001e2b] text-3xl md:text-4xl pb-4 ${urbanist.className}`}><strong>Cambiar contraseña</strong></h1>
                    <p className="text-[#001e2b] antialiased pb-8">Ingresa tu correo, tu nueva contraseña y manda tu solicitud.</p>
                    <FormularioOlvide></FormularioOlvide>
                </div>
            </div>
            <div className="hidden md:flex md:justify-start md:items-center md:rounded-4xl bg-[url(/personas.png)] w-3/5 h-full md:bg-cover md:bg-center">
            </div>
        </div>
        
    )
}