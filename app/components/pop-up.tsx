/* DOCUMENTACIÓN - Pop-Up en la Pantalla

CLASIFICACIÓN
- aprobado: verde
- denegado: rojo
- errorSist: rojo oscuro
- info: azul
 
PROPIEDADES
tipo: clasificación
mensaje: ""
cierreAuto: si se cierra automáticamente (tiempo) **OPCIONAL**
tiempo: tiempo en ms para cerrar **OPCIONAL**
funCerrar: funcion que se ejecuta al cerrar **OPCIONAL**
*/

"use client"

import { useState } from 'react';

export default function CardWithPopup() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="p-6">
      {/* Card */}
      <div
        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowPopup(true)}
      >
        <h2 className="text-xl font-semibold">Haz clic aquí</h2>
        <p className="text-gray-600">Esto abrirá un popup.</p>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Este es el popup</h3>
            <p className="mb-4">Contenido del popup que se muestra al hacer clic en la card.</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
