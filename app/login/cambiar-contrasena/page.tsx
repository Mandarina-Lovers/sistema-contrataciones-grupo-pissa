'use client'
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/pissa_bg.png')" }}
    >
      {/* Sección izquierda */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10">
        <Image
          src="/logo_pissa.png"
          width={300}
          height={300}
          alt="Pissa logo"
        />
        <h1 className="text-4xl font-bold">Portal de Contratación</h1>
        <p className="text-lg mt-4 text-center">
          Entrega de documentación y seguimiento de expediente digital para colaboradores de Grupo Pissa
        </p>
      </div>
      {/* Sección derecha */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">CAMBIAR CONTRASEÑA</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                placeholder="Confirmar nueva contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Cambiar Contraseña
            </button>
            <div className="mb-4 text-center py-4">
              <a href="/login" className="text-blue-500 hover:underline">
                Regresar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}