'use client'
import React, { useState } from 'react';

type DocumentStatus = "aprobado" | "pendiente" | "por revisar" | "rechazado" | "no subido";

interface DocumentItem {
  id: number;
  name: string;
  status: DocumentStatus;
}

const documentsData: DocumentItem[] = [
  { id: 1, name: 'Documento 1', status: 'aprobado' },
  { id: 2, name: 'Documento 2', status: 'pendiente' },
  { id: 3, name: 'Documento 3', status: 'por revisar' },
  { id: 4, name: 'Documento 4', status: 'rechazado' },
  { id: 5, name: 'Documento 5', status: 'no subido' },
  { id: 6, name: 'Documento 6', status: 'no subido' },
];

export default function DocumentsManager() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [manualInfo, setManualInfo] = useState("");

  return (
    <div className="flex min-h-screen">
      {/* Lista de documentos */}
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Documentos</h2>
        <ul>
          {documentsData.map(doc => (
            <li
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-3 mb-2 border rounded cursor-pointer hover:bg-gray-100 ${selectedDoc?.id === doc.id ? 'bg-gray-200' : ''}`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{doc.name}</span>
                <span className="text-sm text-gray-600">{doc.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Área de acciones para el documento seleccionado */}
      <div className="w-2/3 p-4">
        {selectedDoc ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Opciones para: {selectedDoc.name}</h2>
            
            {/* Subir archivo */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Subir archivo:</label>
              <input type="file" className="border p-2 w-full" />
            </div>

            {/* Botones de acciones */}
            <div className="mb-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">Descargar</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
            </div>

            {/* Campos manuales */}
            <div>
              <label className="block mb-2 font-semibold">Información manual:</label>
              <textarea
                className="border p-2 w-full"
                value={manualInfo}
                onChange={(e) => setManualInfo(e.target.value)}
                placeholder="Ingresa información manual..."
                rows={4}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Seleccione un documento de la lista para ver las opciones.</p>
        )}
      </div>
    </div>
  );
}