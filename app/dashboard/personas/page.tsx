"use client";

import { useState } from "react";
import ListUsers from "../../components/lista-candidatos";
import ListRecursos from "../../components/lista-rh";
import { urbanist } from "../../components/fonts";
import ListEmpleados from "@/app/components/lista-general";

export default function VistaUsuarios() {
  const [activo, setActivo] = useState<"candidatos" | "recursos humanos" | "empleados">("candidatos");

  return (
    <div className="flex-1 overflow-y-auto pb-4 md:mt-0">
      <h1 className={`${urbanist.className} text-3xl text-[#212529] pl-4 mb-4`}>
        <strong>Personas</strong>
      </h1>

      <div className="flex space-x-6 border-b border-gray-300 items-center ml-4">
        <button
          onClick={() => setActivo("candidatos")}
          className={`pb-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activo === "candidatos"
              ? "border-[#2d4583] text-[#2d4583]"
              : "border-transparent text-gray-500 hover:text-[#2d4583]"
          }`}
        >
          Candidatos
        </button>

        <button
          onClick={() => setActivo("recursos humanos")}
          className={`pb-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activo === "recursos humanos"
              ? "border-[#2d4583] text-[#2d4583]"
              : "border-transparent text-gray-500 hover:text-[#2d4583]"
          }`}
        >
          Recursos Humanos
        </button>

        <button
          onClick={() => setActivo("empleados")}
          className={`pb-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activo === "empleados"
              ? "border-[#2d4583] text-[#2d4583]"
              : "border-transparent text-gray-500 hover:text-[#2d4583]"
          }`}
        >
          Empleados
        </button>
      </div>

      {activo === "candidatos" && <ListUsers />}
      {activo === "recursos humanos" && <ListRecursos />}
      {activo === "empleados" && <ListEmpleados/>}
    </div>
  );
}