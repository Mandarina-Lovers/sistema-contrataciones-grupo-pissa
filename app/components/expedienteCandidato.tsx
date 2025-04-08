'use client'

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X, Clock } from 'lucide-react';
import { set, ref, get, update } from 'firebase/database';
import { database } from '@/firebaseConfig';
import Uploader from "@/app/components/Uploader";
import ManagerViewer from "@/app/components/ManagerViewer";

interface ExpedienteCandidatoProps {
    userId: string | undefined; // Adjust type if needed
}


// Definición de tipos
type DocumentState = 'approved' | 'reviewing' | 'rejected' | 'not_uploaded';

interface ManualField {
    key: string;
    value: string;
    label: string;
}

interface DocumentFields {
    fields: ManualField[];
    notas?: string; // Adding notas as an optional string field

}

interface Document {
    id: number;
    name: string;
    state: DocumentState;
    file: string | null;
    fields: DocumentFields;
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
    switch (dbState) {
        case 'aprobado': return DOCUMENT_STATES.APPROVED;
        case 'pendiente_de_revisar': return DOCUMENT_STATES.REVIEWING;
        case 'rechazado': return DOCUMENT_STATES.REJECTED;
        case 'no_subido': return DOCUMENT_STATES.NOT_UPLOADED;
        default: return DOCUMENT_STATES.NOT_UPLOADED;
    }
};

const formatFieldName = (key: string): string => {
    // 'fechaNacimiento' -> 'Fecha de Nacimiento'
    return key
        .replace(/([A-Z])/g, ' $1') // Inserta espacio antes de mayúsculas
        .replace(/^./, str => str.toUpperCase()) // Primera letra en mayúscula
        .trim();
};

// Props para el componente StateIcon
interface StateIconProps {
    state: DocumentState;
}

// Iconos para cada estado
const StateIcon: React.FC<StateIconProps> = ({ state }) => {
    switch (state) {
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

const ExpedienteCandidato: React.FC<ExpedienteCandidatoProps> = ({ userId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<number>(1);
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expedienteId, setExpedienteId] = useState<string | null>(null);
    const [candidateId, setCandidateId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                // 1. Obtener el ID del candidato de la cookie
                const candidateId = userId;

                if (!candidateId) {
                    setError('No se encontró el ID del candidato en las cookies');
                    setLoading(false);
                    return;
                }

                setCandidateId(candidateId);

                // 2. Obtener los datos del usuario
                const userRef = ref(database, `usuarios/${candidateId}`);
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
                        if ((data as { id_candidato: string }).id_candidato === candidateId) {
                            foundExpedienteId = id;
                            setExpedienteId(id);

                            // Fetch notes if they exist
                            if ((data as any).notas) {
                                setNotes((data as any).notas);
                            }

                            break;
                        }
                    }
                }

                if (!foundExpedienteId) {
                    // Si no existe un expediente, lo creamos
                    const newExpedienteRef = ref(database, 'expedientes/expediente' + Date.now());
                    await update(newExpedienteRef, {
                        id_candidato: candidateId,
                        notas: "", // Initialize notas as empty string
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
                    setNotes(""); // Initialize notes as empty for new expediente
                } else {
                    // If we found an expediente but haven't fetched the notes yet (rare case)
                    const expedienteNotasRef = ref(database, `expedientes/${foundExpedienteId}/notas`);
                    const notasSnapshot = await get(expedienteNotasRef);
                    if (notasSnapshot.exists()) {
                        setNotes(notasSnapshot.val());
                    } else {
                        setNotes(""); // Set empty notes if not found
                    }
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
                    // Convertir campos de la BD en un array de campos
                    const fieldsArray: ManualField[] = [];

                    if (docData.campos && typeof docData.campos === 'object') {
                        // Crear campos basados en lo que hay en la BD
                        Object.entries(docData.campos).forEach(([key, value]) => {
                            fieldsArray.push({
                                key,
                                value: value as string,
                                label: formatFieldName(key) // Función para formatear el nombre
                            });
                        });
                    } else {
                        // Campos por defecto según el tipo de documento
                        switch (docName) {
                            case 'ActaNacimiento':
                                fieldsArray.push(
                                    { key: 'fechaNacimiento', value: '', label: 'Fecha de Nacimiento' },
                                    { key: 'lugarExpedicion', value: '', label: 'Lugar de Expedición' }
                                );
                                break;
                            case 'CURP':
                                fieldsArray.push(
                                    { key: 'curpNumero', value: '', label: 'Número de CURP' }
                                );
                                break;
                            case 'INE':
                                fieldsArray.push(
                                    { key: 'claveElector', value: '', label: 'Clave de Elector' },
                                    { key: 'emision', value: '', label: 'Fecha de Emisión' }
                                );
                                break;
                            case 'CV':
                                fieldsArray.push(
                                    { key: 'experiencia', value: '', label: 'Años de Experiencia' },
                                    { key: 'educacion', value: '', label: 'Educación' }
                                );
                                break;
                        }
                    }

                    return {
                        id: index + 1,
                        name: docName,
                        state: mapDbStateToComponentState(docData.estado),
                        file: docData.url ? extractFileNameFromUrl(docData.url) : null,
                        fields: { fields: fieldsArray }
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

    // Function to save notes
    const saveNotes = async () => {
        if (!expedienteId) return;

        try {
            const docRef = ref(database, `expedientes/${expedienteId}/notas`);
            await set(docRef, notes);
        } catch (error) {
            console.error("Error saving notes:", error);
        }
    };

    // Handle notes textarea changes
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
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

    // Actualizar campo manual sin guardarlo en la base de datos inmediatamente
    const handleFieldChange = (fieldKey: string, value: string): void => {
        setDocuments(documents.map(doc => {
            if (doc.id === selectedDoc) {
                // Copia el documento y actualiza el campo específico
                const updatedFields = doc.fields.fields.map(field =>
                    field.key === fieldKey ? { ...field, value } : field
                );

                return {
                    ...doc,
                    fields: {
                        fields: updatedFields
                    }
                };
            }
            return doc;
        }));
    };

    // Nueva función para guardar todos los campos a la vez
    const handleSaveFields = (): void => {
        if (!expedienteId || !currentDocument) return;

        // Crear un objeto con todos los campos para actualizar la base de datos
        const fieldsToSave: Record<string, string> = {};

        currentDocument.fields.fields.forEach(field => {
            fieldsToSave[field.key] = field.value;
        });

        // Referencia a la carpeta de campos del documento actual
        const camposRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}/campos`);

        // Actualizar todos los campos a la vez
        update(camposRef, fieldsToSave)
            .then(() => {
                console.log(`Campos de ${currentDocument.name} actualizados`);
                alert("Se han guaradados los cambios exitosamente :)!")
            })
            .catch(err => {
                console.error(`Error al actualizar campos:`, err);
            });
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
                                    className={`absolute top-0 left-0 h-full ${doc.state === DOCUMENT_STATES.APPROVED
                                        ? 'bg-green-500'
                                        : doc.state === DOCUMENT_STATES.PENDING
                                            ? 'bg-orange-500'
                                            : doc.state === DOCUMENT_STATES.REVIEWING
                                                ? 'bg-yellow-500'
                                                : doc.state === DOCUMENT_STATES.REJECTED
                                                    ? 'bg-red-500'
                                                    : 'bg-gray-300'
                                        }`}
                                    style={{ width: '100%' }}
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">
                                    Ingresa manualmente los datos de tu {currentDocument.name}
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {currentDocument.fields.fields.map((field) => (
                                    <div key={field.key} className="flex flex-col">
                                        <label htmlFor={field.key} className="text-sm font-medium text-gray-700 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.key}
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            placeholder={field.label}
                                            value={field.value}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={handleSaveFields}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Guardar Datos
                                </button>
                            </div>

                            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Notas del Candidato</h3>
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    rows={4}
                                    value={notes}
                                    onChange={handleNotesChange}
                                    placeholder="Añadir notas sobre este candidato..."
                                />
                                <button
                                    onClick={saveNotes}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Guardar Notas
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExpedienteCandidato;