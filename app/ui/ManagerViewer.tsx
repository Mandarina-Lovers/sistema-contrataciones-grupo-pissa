'use client';

import React, { useState } from 'react';
import { Eye, Trash } from 'lucide-react';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import PdfModal from '@/app/ui/PdfModal'

interface ManagerViewerProps {
  filePath: string;
  fileName: string;
  onFileDeleted?: () => void;
}

export default function ManagerViewer({ filePath, fileName, onFileDeleted }: ManagerViewerProps) {
  const [showPdf, setShowPdf] = useState(false);

  // Al pulsar el botón "ver", se abre el PdfModal internamente
  const handleView = () => {
    setShowPdf(true);
  };

  // Cierra el PdfModal
  const handleCloseModal = () => {
    setShowPdf(false);
  };

  // Se borra el archivo de Firebase Storage y se ejecuta la callback onFileDeleted (si se pasó)
  const handleDeleteFile = async () => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      if (onFileDeleted) onFileDeleted();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button onClick={handleView} className="bg-blue-900 text-white p-4 rounded-lg inline-block">
        <Eye size={32} />
      </button>
      <span>{fileName}</span>
      <button onClick={handleDeleteFile} className="text-red-500">
        <Trash size={24} />
      </button>
      {showPdf && <PdfModal filePath={filePath} onClose={handleCloseModal} />}
    </div>
  );
}
