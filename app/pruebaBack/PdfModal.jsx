// components/PdfModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export default function PdfModal({ filePath, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        setPdfUrl(url);
      } catch (err) {
        setError('Error al cargar el PDF');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [filePath]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <p>Cargando PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Visualizador de PDF</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="w-full h-[80vh]">
          <iframe 
            src={pdfUrl}
            className="w-full h-full border"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="mt-4 flex justify-end">
          <a 
            href={pdfUrl} 
            download
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  );
}