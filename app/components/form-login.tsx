'use client'

//Firebase
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";


export default function Formulario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredentials.user.uid;
      console.log("Logged in as:", userCredentials.user);
  
      {/* SendEmail
      try {
        //sendEmailk
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressee: email,
            subject: "Inicio de sesión exitoso",
            text: "Has iniciado sesión correctamente en el sistema de contrataciones.",
          }),
        });
  
        if (!response.ok) {
          throw new Error("Error sending email");
        }
  
        console.log("Login email sent successfully");
      } catch (emailError: any) {
        console.error("Error sending email:", emailError);
      }
      */}

      // Guardar el candidateId en una cookie
      document.cookie = `candidateId=${uid}; path=/; secure; samesite=strict; max-age=86400`; // Expira en 1 día

      // Redirigir después del inicio de sesión exitoso
      router.push("/expediente-candidatos/opcion2");
    } catch (err: any) {
      console.error("Error during login:", err);
    }
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
  );
}