"use client";

import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "usuarios");

    get(usersRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          console.log("No hay datos disponibles");
          return;
        }
        const dataValue = snapshot.val();
        if (typeof dataValue !== "object" || dataValue === null) {
          console.log("Datos inválidos o formato inesperado");
          return;
        }

        const usersArray = Object.entries(dataValue).map(([id, value]) => {
          return {
            id,
            ...(value ?? {}),
          };
        });

        setUsers(usersArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="flex-1 bg-gray-100 p-4">
      <div className="bg-gray-300 flex items-center space-x-4 p-2 rounded-b-lg">
        <select className="bg-white text-black p-2 rounded">
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-white text-black p-2 rounded"
        />
      </div>
      <h2 className="text-xl font-semibold text-black mt-4">
        Datos desde Firebase
      </h2>

      <pre className="bg-white p-2 rounded text-black mt-4 text-sm">
        {JSON.stringify({ users }, null, 2)}
      </pre>
    </main>
  );
}
