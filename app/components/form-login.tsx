'use client'

//Firebase
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

// Íconos 
import { Eye, EyeOff, X} from "lucide-react";


export default function Formulario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mostrarContraseña, setShowPassword] = useState(false);

  /*Andy (04.04 9:28) Para las alertas durante el login*/
  const [alertaAcceso, setAlertaAcceso] = useState<{type: 'denegado', mensaje: string} | null> (null);

  const router = useRouter();

  /*Andy (04.04 9:54) Esto es para que la alerta de eror desaparezca solo cuando el usuario
  ha cambiado por lo menos un valor en el campo del email o contraseña*/ 
    const cambioEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);      // Cuando hay  un cambio en el input de correo...
    if (alertaAcceso)              // si la alerta de acceso tiene algún valor, por ejemplo 'denegado'...
       {setAlertaAcceso(null);}   // reestablece el valor a null (desaparece la alerta)
  };

  const cambioContrasena = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (alertaAcceso) {
      setAlertaAcceso(null);
    }
  };
/********************************************************************/



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





      
/**********************************************************************************
 Alerta de Acceso Denegado*/
      setAlertaAcceso({
        type: 'denegado',
        mensaje: 'El usuario o la contraseña son incorrectos'
      });
/************************************************************************************/
    }
  };

  return(
    <>
      <form onSubmit={handleLogin}>
        {alertaAcceso && (
          <div className={`mb-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            'bg-red-500'
          } text-white`}>
            <span>{alertaAcceso.mensaje}</span>
            <button 
              onClick={() => setAlertaAcceso(null)}
              className="ml-2 hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            className={`w-full p-2 border rounded-lg mt-1 bg-[#fafbfc] ${
              alertaAcceso 
                ? 'border-red-400 text-red-600 placeholder-red-400' 
                : 'border-gray-300 text-black'
            }`}
            placeholder="Correo electrónico"
            value={email}
            onChange={cambioEmail}
            required
          />
        </div>
        <div className="mb-4 relative"> 
          <input
            type={mostrarContraseña ? "text" : "password"}
            className={`w-full p-2 border rounded-lg mt-1 bg-[#fafbfc] ${
              alertaAcceso 
                ? 'border-red-400 text-red-600 placeholder-red-400' 
                : 'border-gray-300 text-black'
            }`}
            placeholder="Contraseña"
            value={password}
            onChange={cambioContrasena}
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
          <a href="/olvidaste" className="text-[#2975a0] hover:text-[#08b177]">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </>
  );
}