/* DOCUMENTACIÓN - Contraseñas

PROPIEDADES
value: contraseña
onChange: si hay cambios en el input
placeholder: texto descriptivo (default: "Contraseña") **OPCIONAL**
error: contorno rojo si hay error **OPCIONAL**
required: por si el campo es obligatorio (default: true) **OPCIONAL**
*/

'use client'

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PropContrasena {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  required?: boolean;
}

export function CampoContrasena({
  value,
  onChange,
  placeholder = "Contraseña",
  error = false,
  required = true
}: PropContrasena) {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  return (
    <div className="mb-4 relative">
      <input
        type={mostrarContrasena ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full p-2 border rounded-lg mt-1 bg-[#fafbfc] ${
          error ? 'border-red-400 text-red-600 placeholder-red-400' : 'border-gray-300 text-black'
        }`}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => setMostrarContrasena(!mostrarContrasena)}
          aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"

        >
          {mostrarContrasena ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      )}
    </div>
  );
}
