'use client'
import { useState } from "react";

export default function FormularioOlvide() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with", email, password, newPassword);
    };

    return(
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-[#001e2b] bg-[#fafbfc]"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-[#001e2b] bg-[#fafbfc]"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-[#001e2b] bg-[#fafbfc]"
            placeholder="Confirmar contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-[#2d4583] text-white py-2 rounded-lg hover:bg-[#08b177] transition">
            Enviar solicitud
          </button>
        </div>
        <div className="pt-6 flex items-center justify-center">
          <a href="/" className="items-center flex hover:text-[#08b177] text-[#2975a0] group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left transition-all group-hover:scale-x-125">
              <path d="M6 8L2 12L6 16"/><path d="M2 12H22"/>
            </svg>
            <span className="pl-2">Regresar</span>
          </a>
        </div>
      </form>
    )
}