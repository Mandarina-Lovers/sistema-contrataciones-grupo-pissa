"use client";

import { useState } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import ListUsers from "../components/listusers";
import TablaUsuarios from "../components/tabla-usuarios";
import { urbanist } from "../components/fonts";

export default function VistaUsuarios() {
  const [vistaTabla, setVistaTabla] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 mt-16 md:mt-0">
      <h2 className={`text-xl font-semibold text-black mb-4 pl-4 ${urbanist.className}`}>Candidatos</h2>

      <div className="md:flex hidden">
        <div className="pr-2">
          <button
            onClick={() => setVistaTabla(false)}
            className={`p-2 ${!vistaTabla ? "hidden" : "block"}`}
          >
            <LayoutGrid className="stroke-[#495057]" />
          </button>
        </div>
        <div>
          <button
            onClick={() => setVistaTabla(true)}
            className={`p-2 ${vistaTabla ? "hidden" : "block"}`}
          >
            <Table2 className="stroke-[#495057]" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className={vistaTabla ? "md:hidden" : "block"}>
        <ListUsers />
      </div>
      <div className={vistaTabla ? "md:block" : "hidden"}>
        <TablaUsuarios />
      </div>
    </div>
  );
}