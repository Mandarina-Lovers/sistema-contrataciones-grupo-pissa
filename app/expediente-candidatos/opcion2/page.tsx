'use client'

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X, Clock } from 'lucide-react';
import { ref, get, update } from 'firebase/database';
import { database } from '@/firebaseConfig';
import Uploader from "@/app/components/Uploader";
import ManagerViewer from "@/app/components/ManagerViewer";

// Definición de tipos
type DocumentState = 'approved' | 'reviewing' | 'rejected' | 'not_uploaded';

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
  REVIEWING: 'reviewing', 
  REJECTED: 'rejected',
  NOT_UPLOADED: 'not_uploaded'
};

// Mapeo de estados de la BD a estados del componente
const mapDbStateToComponentState = (dbState: string): DocumentState => {
  switch(dbState) {
    case 'aprobado': return DOCUMENT_STATES.APPROVED;
    case 'pendiente_de_revisar': return DOCUMENT_STATES.REVIEWING;
    case 'rechazado': return DOCUMENT_STATES.REJECTED;
    case 'no_subido': return DOCUMENT_STATES.NOT_UPLOADED;
    default: return DOCUMENT_STATES.NOT_UPLOADED;
  }
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expedienteId, setExpedienteId] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener el ID del candidato de la cookie
        const candidateIdFromCookie = getCandidateIdFromCookies();
        
        if (!candidateIdFromCookie) {
          setError('No se encontró el ID del candidato en las cookies');
          setLoading(false);
          return;
        }
        
        setCandidateId(candidateIdFromCookie);
        
        // 2. Obtener los datos del usuario
        const userRef = ref(database, `usuarios/${candidateIdFromCookie}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
          setError('No se encontró el usuario en la base de datos');
          setLoading(false);
          return;
        }
        
        // 3. Buscar el expediente asociado al candidato
        const expedientesRef = ref(database, 'expedientes');
        const expedientesSnapshot = await get(expedientesRef);
        
        let foundExpedienteId = null;
        
        if (expedientesSnapshot.exists()) {
          const expedientes = expedientesSnapshot.val();
          
          // Buscar el expediente que corresponde al candidato
          for (const [id, data] of Object.entries(expedientes)) {
            if ((data as { id_candidato: string }).id_candidato === candidateIdFromCookie) {
              foundExpedienteId = id;
              setExpedienteId(id);
              break;
            }
          }
        }
        
        if (!foundExpedienteId) {
          // Si no existe un expediente, lo creamos
          const newExpedienteRef = ref(database, 'expedientes/expediente' + Date.now());
          await update(newExpedienteRef, {
            id_candidato: candidateIdFromCookie,
            documentos: {
              ActaNacimiento: {
                estado: 'no_subido',
                url: '',
                campos: {}
              },
              CURP: {
                estado: 'no_subido',
                url: '',
                campos: {}
              },
              INE: {
                estado: 'no_subido',
                url: '',
                campos: {}
              },
              CV: {
                estado: 'no_subido',
                url: '',
                campos: {}
              }
            }
          });
          
          // Obtener el ID generado
          const newExpedienteSnapshot = await get(newExpedienteRef);
          foundExpedienteId = newExpedienteSnapshot.key;
          setExpedienteId(foundExpedienteId);
        }
        
        // 4. Obtener los datos del expediente
        const expedienteRef = ref(database, `expedientes/${foundExpedienteId}/documentos`);
        const expedienteSnapshot = await get(expedienteRef);
        
        // Si no hay documentos, inicializamos con valores por defecto
        if (!expedienteSnapshot.exists()) {
          setError('No se encontraron documentos en el expediente');
          setLoading(false);
          return;
        }
        
        // 5. Transformar los datos a la estructura esperada por el componente
        const expedienteData = expedienteSnapshot.val();
        const docsArray: Document[] = Object.entries(expedienteData).map(([docName, docData]: [string, any], index) => {
          return {
            id: index + 1,
            name: docName,
            state: mapDbStateToComponentState(docData.estado),
            file: docData.url ? extractFileNameFromUrl(docData.url) : null,
            manualFields: { 
              value: docData.campos ? Object.values(docData.campos).join(', ') : ''
            }
          };
        });
        
        setDocuments(docsArray);
        if (docsArray.length > 0) {
          setSelectedDoc(docsArray[0].id);
        }
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del expediente');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Función auxiliar para obtener el candidateId de las cookies
  const getCandidateIdFromCookies = (): string | null => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const candidateCookie = cookies.find(row => row.startsWith('candidateId='));
      return candidateCookie ? candidateCookie.split('=')[1] : null;
    }
    return null;
  };
  
  // Función auxiliar para extraer el nombre del archivo de una URL
  const extractFileNameFromUrl = (url: string): string => {
    if (!url) return '';
    // Si url es algo como "pruebaInicial/archivo.pdf", extraemos "archivo.pdf"
    return url.split('/').pop() || url;
  };

  // Manejar carga de archivos
  const handleFileUpload = (fileName: string, snapshot: unknown) => {
    // Actualizar el estado local
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === selectedDoc
          ? { ...doc, file: fileName, state: DOCUMENT_STATES.REVIEWING }
          : doc
      )
    );
    
    console.log("Archivo subido:", fileName, snapshot);
  };
  
  // Eliminar archivo
  const handleDeleteFile = (): void => {
    // Actualizar el estado local
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc 
        ? { ...doc, file: null, state: DOCUMENT_STATES.NOT_UPLOADED } 
        : doc
    ));
  };
  
  // Actualizar campo manual
  const handleManualFieldChange = (value: string): void => {
    // Actualizar el estado local
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc 
        ? { ...doc, manualFields: { ...doc.manualFields, value } } 
        : doc
    ));

  };

  // Encontrar el documento seleccionado
  const currentDocument = documents.find(doc => doc.id === selectedDoc);
  
  if (loading) {
    return <div className="p-6 text-center">Cargando datos del expediente...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  
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
                expedienteId={expedienteId || undefined}
                documentoId={currentDocument.name}
                fileName={currentDocument.file}
                folder="pruebaInicial"
                onFileDeleted={handleDeleteFile}
                />
              ) : (
                <Uploader 
                  expedienteId={expedienteId || undefined}
                  documentoId={currentDocument.name}
                  onFileUploaded={handleFileUpload}
                />
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