"use client";

import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";

interface User {
  id: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  telefono?: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(database, "usuarios"));
        if (!snapshot.exists()) {
          console.log("No hay datos disponibles");
          return;
        }

        const dataValue = snapshot.val();
        if (typeof dataValue !== "object" || dataValue === null) {
          console.log("Datos inválidos o formato inesperado");
          return;
        }

        const usersArray = Object.entries(dataValue).map(([id, value]) => ({
          id,
          ...(value as Omit<User, "id">),
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="flex-1 bg-gray-100 p-4">
      <h2 className="text-xl font-semibold text-black mb-4">
        Datos desde Firebase
      </h2>

      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Nombre</th>
              <th className="border p-2 text-black">Apellidos</th>
              <th className="border p-2 text-black">Rol</th>
              <th className="border p-2 text-black">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, nombre, apellidos, rol, telefono }) => (
              <tr key={id} className="text-center">
                <td className="border p-2 text-black">{nombre || "N/A"}</td>
                <td className="border p-2 text-black">{apellidos || "N/A"}</td>
                <td className="border p-2 text-black">{rol || "N/A"}</td>
                <td className="border p-2 text-black">{telefono || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
