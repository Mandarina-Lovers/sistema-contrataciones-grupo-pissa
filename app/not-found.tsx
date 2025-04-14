import Image from "next/image";
import { urbanist } from "@/app/components/fonts";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#2d4583] md:bg-white h-screen p-8 md:flex md:justify-center md:items-center">
      <div className="bg-white md:bg-white p-8 rounded-xl shadow-lg w-full md:w-1/2 flex flex-col items-center gap-6">
        <Image
          src="/logo_pissa.png"
          alt="Logo"
          width={100}
          height={60}
          className="hidden md:block"
        />
        <h2
          className={`text-2xl md:text-3xl font-bold text-black ${urbanist.className}`}
        >
          Página no encontrada
        </h2>
        <p className="text-black text-center">
          Revisa que la URL sea correcta o regresa a la página principal.
        </p>
        <Link
          href="/"
          className="bg-[#2d4583] text-white px-6 py-2 rounded-lg hover:bg-[#08b177] transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
