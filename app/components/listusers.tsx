"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import ProfilePicture from "./profile-picture";
import { Mail, Phone } from "lucide-react";

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
      className="cursor-pointer p-4 bg-white rounded-xl shadow-md transition-transform transform hover:scale-105 md:h-30 h-45 border-gray-300 border flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex-none pr-2">
          <ProfilePicture nombre={`${user.nombre || ""} ${user.apellidos || ""}`} />
        </div>
        <div className="text-lg font-semibold text-black pb-4 flex-auto">{user.nombre || "N/A"} {user.apellidos || ""}</div>
        <div className="text-sm text-blue-400 flex-initial">{user.rol || "N/A"}</div>
      </div>
      <div className="text-sm text-[#495057] flex flex-row"><Mail className="pr-2"/> {user.email || "N/A"}</div>
      <div className="text-sm text-[#495057] flex flex-row"><Phone className="pr-2"/>{user.telefono || "N/A"}</div>
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
    <main className="flex-1 p-4">
      <div className="mb-4 flex gap-2 text-black">
        {/*<label>Ordenar por:</label>*/}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-1 rounded-lg bg-[#2d4583] text-white"
        >
          <option value="">Ordenar</option>
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
