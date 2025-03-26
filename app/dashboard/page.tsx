'use client'
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">INICIAR SESIÓN</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                placeholder="Ingresa correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                placeholder="Ingresa contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 text-right">
              <a href="#" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Iniciar Sesión
            </button>
            <a href="#_" className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
    <span className="relative">Submit</span>
      </a>
          </form>
        </div>
      </div>
    </div>
  );
}