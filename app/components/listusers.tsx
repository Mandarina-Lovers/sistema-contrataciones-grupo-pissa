"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const UserCard = ({ user }: { user: User }) => {
  const router = useRouter();
  
  return (
    <div
      onClick={() => router.push(`/dashboard/${user.id}`)}
      className="cursor-pointer p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 h-23"
    >
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="text-lg font-semibold text-black">{user.nombre || "N/A"} {user.apellidos || ""}</div>
        <div className="text-sm text-gray-600">{user.rol || "N/A"}</div>
      </div>
      <div className="text-sm text-gray-600 hidden md:block">{user.email || "N/A"}</div>
      <div className="text-sm text-gray-800">{user.telefono || "N/A"}</div>
    </div>
  );
};

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(database, "usuarios"));
        if (!snapshot.exists()) return;

        const dataValue = snapshot.val();
        if (typeof dataValue !== "object" || dataValue === null) return;

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
    let prop: keyof User = "nombre";
    if (sortOption.includes("apellido")) prop = "apellidos";
    
    const textA = (a[prop] || "").toLowerCase();
    const textB = (b[prop] || "").toLowerCase();
    
    return sortOption.includes("ZA")
      ? textB.localeCompare(textA)
      : textA.localeCompare(textB);
  });

  return (
    <main className="flex-1 bg-gray-100 p-4">
      <h2 className="text-xl font-semibold text-black mb-4">Usuarios</h2>
      
      <div className="mb-4 flex gap-2 text-black">
        <label className="font-semibold">Ordenar por:</label>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
        {sortedUsers.map((user) => (
          <UserCard key={user.id} user={user}/>
        ))}
      </div>
    </main>
  );
}
