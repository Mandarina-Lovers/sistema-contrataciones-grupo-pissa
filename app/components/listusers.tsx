"use client";

import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";

interface User {
  id: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  email?: string;
  telefono?: string;
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortOption, setSortOption] = useState("");

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

  const sortedUsers = [...users].sort((a, b) => {
    // Sort by "nombre" or "apellidos" depending on sortOption
    let prop: keyof User = "nombre";
    if (sortOption.includes("apellido")) prop = "apellidos";

    const textA = (a[prop] || "").toLowerCase();
    const textB = (b[prop] || "").toLowerCase();

    if (sortOption.includes("ZA")) {
      // Descending
      if (textA < textB) return 1;
      if (textA > textB) return -1;
      return 0;
    } else {
      // Ascending
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    }
  });

  return (
    <main className="flex-1 bg-gray-100 p-4">
      <h2 className="text-xl font-semibold text-black mb-4">
        Datos desde Firebase
      </h2>

      {/* Filter bar */}
      <div className="mb-4 flex gap-2 text-black">
        <label className="text-black font-semibold">Ordenar por:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 p-1"
        >
          <option value="">-- Seleccionar --</option>
          <option value="nombreAZ">Nombre A → Z</option>
          <option value="nombreZA">Nombre Z → A</option>
          <option value="apellidoAZ">Apellido A → Z</option>
          <option value="apellidoZA">Apellido Z → A</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Nombre</th>
              <th className="border p-2 text-black">Apellidos</th>
              <th className="border p-2 text-black">Rol</th>
              <th className="border p-2 text-black">Email</th>
              <th className="border p-2 text-black">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, nombre, apellidos, rol, email, telefono }) => (
              <tr key={id} className="text-center">
                <td className="border p-2 text-black">{nombre || "N/A"}</td>
                <td className="border p-2 text-black">{apellidos || "N/A"}</td>
                <td className="border p-2 text-black">{rol || "N/A"}</td>
                <td className="border p-2 text-black">{email || "N/A"}</td>
                <td className="border p-2 text-black">{telefono || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
// ...existing code...
