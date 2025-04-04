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

export default function TablaUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(database, "usuarios"));
        if (!snapshot.exists()) return;

        const data = snapshot.val();
        const usersArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<User, "id">),
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const filtrarUsuarios = users.filter((user) => {
    const buscar = searchTerm.toLowerCase();
    return (
      user.id?.toLowerCase().includes(buscar) ||
      user.nombre?.toLowerCase().includes(buscar) ||
      user.apellidos?.toLowerCase().includes(buscar) ||
      user.email?.toLowerCase().includes(buscar) ||
      user.rol?.toLowerCase().includes(buscar)
    );
  });

  const usuariosFiltradosYOrdenados = [...filtrarUsuarios].sort((a, b) => {
    let prop: keyof User = "nombre";
    if (sortOption.includes("apellido")) prop = "apellidos";

    const textA = (a[prop] || "").toLowerCase();
    const textB = (b[prop] || "").toLowerCase();

    return sortOption.includes("ZA")
      ? textB.localeCompare(textA)
      : textA.localeCompare(textB);
  });

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="mb-4 pb-4 flex flex-row">
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-400 rounded-lg"
        />
        <div className="pl-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded-lg bg-[#2d4583] text-white"
          >
            <option value="">Ordenar</option>
            <option value="nombreAZ">Nombre A → Z</option>
            <option value="nombreZA">Nombre Z → A</option>
            <option value="apellidoAZ">Apellido A → Z</option>
            <option value="apellidoZA">Apellido Z → A</option>
          </select>
        </div>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 px-2 py-1 text-start">ID</th>
            <th className="border-b border-gray-300 px-2 py-1 text-start">Nombre</th>
            <th className="border-b border-gray-300 px-2 py-1 text-start">Apellidos</th>
            <th className="border-b border-gray-300 px-2 py-1 text-start">Rol</th>
            <th className="border-b border-gray-300 px-2 py-1 text-start">Correo</th>
            <th className="border-b border-gray-300 px-2 py-1 text-start">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltradosYOrdenados.length === 0 ? (
            <tr>
              <td className="border-b border-gray-300 px-2 py-1 text-center" colSpan={6}>
                No se encontraron usuarios.
              </td>
            </tr>
          ) : (
            usuariosFiltradosYOrdenados.map((user) => (
              <tr key={user.id}>
                <td className="border-b border-gray-300 px-2 py-1">{user.id}</td>
                <td className="border-b border-gray-300 px-2 py-1">{user.nombre || "N/A"}</td>
                <td className="border-b border-gray-300 px-2 py-1">{user.apellidos || "N/A"}</td>
                <td className="border-b border-gray-300 px-2 py-1">{user.rol || "N/A"}</td>
                <td className="border-b border-gray-300 px-2 py-1">{user.email || "N/A"}</td>
                <td className="border-b border-gray-300 px-2 py-1">{user.telefono || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}