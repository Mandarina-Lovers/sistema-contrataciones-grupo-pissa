'use client';

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { database, auth } from "../../firebaseConfig";

import crypto from "crypto";

const generatePassword = (length:any = 16) => {
    return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

export default function CreateCredentials() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const handlePress = async () => {
    // Generamos una contraseña (opcional: podrías permitir que el usuario defina la suya)
    const password = generatePassword();

    try {
      // Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
      const uid = userCredential.user.uid;
      
      // Preparamos los datos para guardar en la Realtime Database.
      // NOTA: No se almacena la contraseña en la base de datos, ya que Firebase Auth se encarga de ello.
      const data = {
        apellidos: lastname,
        email: mail,
        estadoUsuario: "normal",
        nombre: name,
        rol: role,
        telefono: phone
      };

      // Guardamos los datos del usuario usando el UID como key
      await set(ref(database, "usuarios/" + uid), data);

      alert("Se han creado las credenciales exitosamente. UID del usuario: " + uid);
    } catch (error: any) {
      console.error("Error al crear el usuario:", error);
      alert("Error al crear credenciales: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ml-10 md:ml-100 w-150">
      <div className="w-full max-w-sm flex flex-col text-center p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-black text-lg font-semibold">Nombre</h1>
        <input
          type="text"
          className="text-black border border-gray-300 rounded p-2 w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="text-black mt-4">Apellidos</div>
        <input
          type="text"
          className="text-black border border-gray-300 rounded p-2 w-full"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
        />

        <div className="text-black mt-4">Correo</div>
        <input
          type="text"
          className="text-black border border-gray-300 rounded p-2 w-full"
          value={mail}
          onChange={(event) => setMail(event.target.value)}
        />

        <div className="text-black mt-4">Teléfono</div>
        <input
          type="text"
          className="text-black border border-gray-300 rounded p-2 w-full"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <div className="text-black mt-4">Tipo de Usuario</div>
        <div className="flex-col">
          <p className="text-black mt-4">Candidato</p>
          <input
            type="checkbox"
            value="candidato"
            onChange={(event) => setRole(event.target.value)}
          />
          <p className="text-black mt-4">RH</p>
          <input
            type="checkbox"
            disabled
            value="rh"
            onChange={(event) => setRole(event.target.value)}
          />
        </div>

        <button
          className="bg-blue-700 hover:bg-blue-800 active:bg-blue-1000 p-2 rounded border-none text-white px-6 py-5 text-center text-lg inline-block m-1"
          onClick={handlePress}
        >
          Crear Credenciales
        </button>
      </div>
    </div>
  );
}