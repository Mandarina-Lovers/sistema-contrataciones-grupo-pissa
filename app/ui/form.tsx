'use client'
import { useState } from "react";
import Button from "./button";

export default function Formulario() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with", email, password);
    };

    return(
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-black"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-black"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button
          type="submit"
          className="w-full bg-[#2d4583] text-white py-2 rounded-lg hover:bg-[#2975a0] transition">
          Iniciar Sesión
        </button>
        <div className="mb-4 text-center py-4 pt-0 md:pt-25">
          <a href="/login/cambiar-contrasena" className="text-[#2975a0] hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    )
}

