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
    <html>
    <div className=" flex items-center justify-center w-full h-full">
      <div className="w-full max-w-sm flex flex-col p-8 bg-white rounded-xl shadow-md border border-gray-300">
        <h1 className="text-black">Nombre</h1>
        <input
          type="text"
          className="text-black border border-gray-300 bg-[#fafbfc] rounded-lg p-2 w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="text-black mt-4">Apellidos</div>
        <input
          type="text"
          className="text-black border border-gray-300 bg-[#fafbfc] rounded-lg p-2 w-full"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
        />

        <div className="text-black mt-4">Correo</div>
        <input
          type="text"
          className="text-black border border-gray-300 bg-[#fafbfc] rounded-lg p-2 w-full"
          value={mail}
          onChange={(event) => setMail(event.target.value)}
        />

        <div className="text-black mt-4">Teléfono</div>
        <input
          type="text"
          className="text-black border border-gray-300 bg-[#fafbfc] rounded-lg p-2 w-full"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        {/*<div className="text-black mt-4">Tipo de Usuario</div>*/}
        <div className="flex-row flex items-center pb-10 pt-4 justify-between">
          <div className="flex-row flex">
            <p className="text-black pr-2">Candidato</p>
            <input
              type="checkbox"
              value="candidato"
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
          <div className="flex-row flex"> 
            <p className="text-black pl-8 pr-2">RH</p>
            <input
              type="checkbox"
              disabled
              value="rh"
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
        </div>

        <button
          className="bg-[#2d4583] text-white py-2 rounded-lg hover:bg-[#08b177] transition px-6 text-center text-lg inline-block m-1"
          onClick={handlePress}
        >
          Crear Credenciales
        </button>
      </div>
    </div>
    </html>
  );
}
