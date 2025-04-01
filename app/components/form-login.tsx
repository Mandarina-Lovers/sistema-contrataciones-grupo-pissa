'use client'
import { useState } from "react";

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
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-black bg-[#fafbfc]"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-black bg-[#fafbfc]"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-[#2d4583] text-white py-2 rounded-lg hover:bg-[#08b177] transition">
            Iniciar Sesión
          </button>
        </div>
        <div className="mb-4 text-center py-4 pt-6">
          <a href="/olvidaste" className="text-[#2975a0] hover:text-[#08b177]">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    )
}

