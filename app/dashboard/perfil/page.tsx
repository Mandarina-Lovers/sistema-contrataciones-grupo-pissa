"use client"
import React from 'react';
import {useRouter} from 'next/navigation'
import ProfilePicture from '@/app/components/profile-picture';

export default function Settings() {
  
  const router = useRouter();

  const onLogout = () => {
    router.push("/");
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h2>
        <div className="flex justify-center mb-6">
          <ProfilePicture nombre={`user.name`} width={"w-15"} height={"h-15"} textSize={"text-3xl"}/>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm">Nombre</label>
            <p className="text-lg font-medium">{"user.name"}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Correo</label>
            <p className="text-lg font-medium">{"user.email"}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Rol</label>
            <p className="text-lg font-medium">{"user.role"}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};


