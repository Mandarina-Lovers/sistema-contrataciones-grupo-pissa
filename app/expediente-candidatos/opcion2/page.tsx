'use client'

// components/DocumentManager.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X, Clock, Upload, Download, Trash } from 'lucide-react';

import Uploader from "@/app/ui/Uploader";
import ManagerViewer from "@/app/ui/ManagerViewer";

// Definición de tipos
type DocumentState = 'approved' | 'pending' | 'reviewing' | 'rejected' | 'not_uploaded';

interface ManualFields {
  value: string;
}

interface Document {
  id: number;
  name: string;
  state: DocumentState;
  file: string | null;
  manualFields: ManualFields;
}

// Constantes de estados
const DOCUMENT_STATES: Record<string, DocumentState> = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REVIEWING: 'reviewing', 
  REJECTED: 'rejected',
  NOT_UPLOADED: 'not_uploaded'
};

// Props para el componente StateIcon
interface StateIconProps {
  state: DocumentState;
}

// Iconos para cada estado
const StateIcon: React.FC<StateIconProps> = ({ state }) => {
  switch(state) {
    case DOCUMENT_STATES.APPROVED:
      return <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><Check className="text-white" size={18} /></div>;
    case DOCUMENT_STATES.PENDING:
      return <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><Clock className="text-white" size={18} /></div>;
    case DOCUMENT_STATES.REVIEWING:
      return <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center"><Clock className="text-white" size={18} /></div>;
    case DOCUMENT_STATES.REJECTED:
      return <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"><X className="text-white" size={18} /></div>;
    case DOCUMENT_STATES.NOT_UPLOADED:
      return <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"><X className="text-gray-500" size={18} /></div>;
    default:
      return null;
  }
};

const DocumentManager: React.FC = () => {
  // Lista de documentos con su estado
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: 'INE', state: DOCUMENT_STATES.APPROVED, file: null, manualFields: { value: '' } },
    { id: 2, name: 'CV', state: DOCUMENT_STATES.APPROVED, file: null, manualFields: { value: '' } },
    { id: 3, name: 'Estado de cuenta', state: DOCUMENT_STATES.PENDING, file: null, manualFields: { value: '' } },
    { id: 4, name: 'CURP', state: DOCUMENT_STATES.APPROVED, file: null, manualFields: { value: '' } },
    { id: 5, name: 'Comprobante de Domicilio', state: DOCUMENT_STATES.REJECTED, file: null, manualFields: { value: '' } },
  ]);

  // Documento seleccionado actualmente
  const [selectedDoc, setSelectedDoc] = useState<number>(1);
  
  // Manejar carga de archivos

  const handleFileUpload = (fileName: string, snapshot: unknown) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === selectedDoc
          ? { ...doc, file: fileName, state: DOCUMENT_STATES.PENDING }
          : doc
      )
    );
    console.log("Archivo subido:", fileName, snapshot);
  };
  
  // Eliminar archivo
  const handleDeleteFile = (): void => {
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc 
        ? { ...doc, file: null, state: DOCUMENT_STATES.NOT_UPLOADED } 
        : doc
    ));
  };
  
  // Actualizar campo manual
  const handleManualFieldChange = (value: string): void => {
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc 
        ? { ...doc, manualFields: { ...doc.manualFields, value } } 
        : doc
    ));
  };

  // Encontrar el documento seleccionado
  const currentDocument = documents.find(doc => doc.id === selectedDoc);
  
  return (
    <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Panel izquierdo - Lista de documentos */}
      <div className="w-1/2 bg-white p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Paso 1: Envío de Documentación</h2>
        
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setSelectedDoc(doc.id)}
            >
              <StateIcon state={doc.state} />
              
              <div className="flex-1 h-1 bg-gray-200 relative">
                <div 
                  className={`absolute top-0 left-0 h-full ${
                    doc.state === DOCUMENT_STATES.APPROVED 
                      ? 'bg-green-500' 
                      : doc.state === DOCUMENT_STATES.PENDING 
                        ? 'bg-orange-500' 
                        : doc.state === DOCUMENT_STATES.REVIEWING 
                          ? 'bg-yellow-500' 
                          : doc.state === DOCUMENT_STATES.REJECTED 
                            ? 'bg-red-500' 
                            : 'bg-gray-300'
                  }`} 
                  style={{width: '100%'}}
                />
              </div>
              
              <span className="font-medium w-48">{doc.name}</span>
              
              {/* Indicador de selección */}
              {selectedDoc === doc.id ? (
                <ChevronUp className="text-blue-800" />
              ) : (
                <ChevronDown className="text-blue-800" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Panel derecho - Gestión del documento seleccionado */}
      <div className="w-1/2 bg-gray-50 p-4">
        {currentDocument && (
          <>
            <div className="text-center mb-8">
              <h3 className="font-medium text-lg mb-2">
                {currentDocument.file 
                  ? "Documento cargado:" 
                  : "Realiza la carga de tu archivo (.pdf)"}
              </h3>
              
              {currentDocument.file ? (
                <ManagerViewer
                  // Construimos la ruta a partir del nombre del archivo; ajusta según tu lógica.
                  filePath={`pruebaInicial/${currentDocument.file}`}
                  fileName={currentDocument.file}
                  // Al presionar el ícono Eye, ManagerViewer mostrará el PdfModal (su lógica interna)
                  // Se pasa la función que elimina el archivo (y actualiza el estado en DocumentManager)
                  onFileDeleted={handleDeleteFile}
                />
              ) : (
                <Uploader onFileUploaded={handleFileUpload} />
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">
                Ingresa manualmente tu {currentDocument.name}
              </h3>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={`${currentDocument.name}`}
                value={currentDocument.manualFields.value}
                onChange={(e) => handleManualFieldChange(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;