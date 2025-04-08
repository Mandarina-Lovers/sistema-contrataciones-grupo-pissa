"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams} from "next/navigation";
import {database} from "../../firebaseConfig"
import {ref, get, set} from "firebase/database"
import path from "path";
import ProfilePicture from "./profile-picture";
import { CircleCheck, CircleUser, Lock, LockOpen, Mail, Phone, UserMinus, UserPlus } from "lucide-react";
import { urbanist } from "./fonts";


interface User {
  id: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  email?: string;
  telefono?: string;
}

export default function Usuarios() {
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
    <div>
      <div className="flex flex-col md:flex-row items-center border-b border-gray-300 pb-6">
        <ProfilePicture nombre={`${name}`} width={"w-15"} height={"h-15"} textSize={"text-3xl"}/>
        <span className="pl-4">
          <div>
            <div className="flex flex-row items-center">
              <strong className={`${urbanist.className} text-2xl text-[#212529]`}>{name} {lastname}</strong>
              <div className="flex flex-row pl-2 items-center">
                {status === "normal" && (
                  <div className="flex flex-row items-center px-2 py-0.5 bg-green-100 rounded">
                    <CircleCheck className="size-4 text-green-800" />
                    <p className="pl-1 text-green-800 capitalize text-xs">Normal</p>
                  </div>
                )}
                {status === "bloqueado" && (
                  <div className="flex flex-row items-center px-2 py-0.5 bg-red-100 rounded">
                    <Lock className="size-4 text-red-800" />
                    <p className="pl-1 text-red-800 capitalize text-xs">Bloqueado</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[#2975a0]">{role}</p>
          </div>
        </span>
        <div className="md:ml-auto">
          <button className="border-2 border-gray-400 text-[#212529] py-2 px-4 rounded-lg mr-2 inline-flex" onClick={handleUnblock}><LockOpen className="pr-2"/> Desbloquear</button>
          <button className="border-2 border-gray-400 text-[#212529] py-2 px-4 rounded-lg mr-2 inline-flex" onClick={handleBlock}><Lock className="pr-2"/> Bloquear</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition inline-flex"><UserMinus className="pr-2"/> Dar de baja</button>
        </div>
      </div>
      <div className="pt-6">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="inline-flex pr-8"><CircleUser className="pr-2"/>ID del Usuario</td>
              <td>{id}</td>
            </tr>
            <tr>
              <td className="inline-flex"><Mail className="pr-2"/> Correo</td>
              <td>{mail}</td>
            </tr>
            <tr>
              <td className="inline-flex"><Phone className="pr-2"/> Teléfono</td>
              <td>{phone}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  
}