'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Eye, EyeOff } from "lucide-react";

export default function Formulario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [mostrarContraseña, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // Autenticación con Firebase
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredentials.user.uid;

      // Llamar a la API para guardar la cookie de forma segura
      const response = await fetch("/api/saveUIDCookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        throw new Error("Error guardando la cookie");
      }

      if (response.ok) {
        console.log("El uid se ha guardado en una cookie :)");
      }

      // Redirigir al dashboard o expediente del candidato
      router.push("/expediente-candidatos/opcion2");

    } catch (err: any) {
      console.error("Error durante login:", err);
    }
  };

  return (
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
      <div className="mb-4 relative">
        <input
           type={mostrarContraseña ? "text" : "password"}
          className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-black bg-[#fafbfc]"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {password.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword(!mostrarContraseña)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {mostrarContraseña ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full bg-[#2d4583] text-white py-2 rounded-lg hover:bg-[#08b177] transition">
          Iniciar Sesión
        </button>
      </div>
      <div className="mb-4 text-center py-4 pt-6">
        <a href="/olvidaste" className="text-[#2975a0] hover:text-[#08b177]">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  );
}
