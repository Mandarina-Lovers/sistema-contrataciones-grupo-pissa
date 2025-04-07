"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams} from "next/navigation";
import {database} from "../../firebaseConfig"
import {ref, get, set} from "firebase/database"
import path from "path";
import ProfilePicture from "./profile-picture";



interface User {
  id: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  email?: string;
  telefono?: string;
}

export default function ListInformation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const id =  pathname.split("/")[2];


  const handleBlock = async () => {

    await set(ref(database, `usuarios/${id}/estadoUsuario`), "bloqueado").then(() => {

      setStatus("bloqueado");
    })
    
  }

  const handleUnblock = async () => {

    await set(ref(database, `usuarios/${id}/estadoUsuario`), "normal").then(() => {

      setStatus("normal");
    })

  }

  useEffect(() => {
    //get(ref(database, `usuarios/${id}`))
     
     const fetchUser = async () => {
          try {
            
            let snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('apellidos').val();
            setLastname(snapshot_buffer);
            snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('nombre').val();
            setName(snapshot_buffer);
            snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('email').val();
            setMail(snapshot_buffer);
            snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('telefono').val();
            setPhone(snapshot_buffer);
            snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('rol').val();
            setRole(snapshot_buffer);
            snapshot_buffer = (await get(ref(database, `usuarios/${id}`))).child('estadoUsuario').val();
            setStatus(snapshot_buffer);
            
          }
        
        catch (e){
          console.error(e);
        }
      }
      fetchUser();
      }, []);
    
  
  

  
  return (
    <div className="flex flex-col items-center p-6 min-h-screen w-300">
      <h1 className="text-4xl font-extrabold text-black mb-6">User Information</h1>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-96 text-center transform transition duration-500 hover:scale-105">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
        />
        <h2 className="text-2xl font-bold text-gray-800">{name + " " + lastname}</h2>
        <p className="text-gray-600 text-sm">{role}</p>
        <p className="mt-4 text-gray-700 text-md italic">{mail}</p>
        <p className="mt-4 text-gray-700 text-md italic">{phone}</p>
        <p className="mt-4 text-gray-700 text-md italic">{status}</p>
      </div>
      

      <div className="mt-4 flex flex-row gap-5 w-200">
        <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition">Convertir en RH</button>
        <button className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition" onClick={handleUnblock}>Desbloquear</button>
        <button className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition" onClick={handleBlock}>Bloquear</button>
        <button className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">Dar de baja</button>
      </div>
    </div>
  );
  
}
