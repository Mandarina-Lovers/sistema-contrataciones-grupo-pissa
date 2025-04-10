'use client'

import {useState, useEffect} from 'react';
import {ChevronDown, ChevronUp, Check, X, Clock, ThumbsUp, ThumbsDown} from 'lucide-react';
import {set, ref, get, update} from 'firebase/database';
import {database} from '@/firebaseConfig';
import ManagerViewer from "@/app/components/ManagerViewer";

interface ExpedienteCandidatoProps
{
    userId: string | undefined; // Adjust type if needed
}


// Definición de tipos
type DocumentState = 'approved' | 'reviewing' | 'rejected' | 'not_uploaded';

interface FieldState
{
    value: string;
    state: 'aprobado' | 'rechazado' | 'pendiente_de_revisar' | 'no_subido';
}

interface ManualField
{
    key: string;
    value: string;
    label: string;
    state: DocumentState; // Usaremos el mismo tipo DocumentState 
}

interface DocumentFields
{
    fields: ManualField[];
    notas?: string; // Adding notas as an optional string field
}

interface Document
{
    id: number;
    name: string;
    fileState: DocumentState;
    fieldsState: DocumentState;
    generalState: DocumentState;
    file: string | null;
    fields: ManualField[];
}

// Constantes de estados
const DOCUMENT_STATES: Record<string, DocumentState> = {
    APPROVED: 'approved',
    REVIEWING: 'reviewing',
    REJECTED: 'rejected',
    NOT_UPLOADED: 'not_uploaded'
};

// Mapeo de estados de la BD a estados del componente
const mapDbStateToComponentState = (dbState: string): DocumentState =>
{
    switch (dbState)
    {
        case 'aprobado': return DOCUMENT_STATES.APPROVED;
        case 'pendiente_de_revisar': return DOCUMENT_STATES.REVIEWING;
        case 'rechazado': return DOCUMENT_STATES.REJECTED;
        case 'no_subido': return DOCUMENT_STATES.NOT_UPLOADED;
        default: return DOCUMENT_STATES.NOT_UPLOADED;
    }
};

const formatFieldName = (key: string): string =>
{
    // 'fechaNacimiento' -> 'Fecha de Nacimiento'
    return key
        .replace(/([A-Z])/g, ' $1') // Inserta espacio antes de mayúsculas
        .replace(/^./, str => str.toUpperCase()) // Primera letra en mayúscula
        .trim();
};

// Props para el componente StateIcon
interface StateIconProps
{
    state: DocumentState;
}

// Iconos para cada estado
const StateIcon: React.FC<StateIconProps> = ({state}) =>
{
    switch (state)
    {
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

const ExpedienteCandidato: React.FC<ExpedienteCandidatoProps> = ({userId}) =>
{
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<number>(1);
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expedienteId, setExpedienteId] = useState<string | null>(null);
    const [candidateId, setCandidateId] = useState<string | null>(null);

    useEffect(() =>
    {
        const fetchUserData = async () =>
        {
            try
            {
                setLoading(true);

                // 1. Obtener el ID del candidato
                const candidateId = userId;

                if (!candidateId)
                {
                    setError('No se encontró el ID del candidato');
                    setLoading(false);
                    return;
                }

                setCandidateId(candidateId);

                // 2. Obtener los datos del usuario
                const userRef = ref(database, `usuarios/${candidateId}`);
                const userSnapshot = await get(userRef);

                if (!userSnapshot.exists())
                {
                    setError('No se encontró el usuario en la base de datos');
                    setLoading(false);
                    return;
                }

                // 3. Buscar el expediente asociado al candidato
                const expedientesRef = ref(database, 'expedientes');
                const expedientesSnapshot = await get(expedientesRef);

                let foundExpedienteId = null;

                if (expedientesSnapshot.exists())
                {
                    const expedientes = expedientesSnapshot.val();

                    // Buscar el expediente que corresponde al candidato
                    for (const [id, data] of Object.entries(expedientes))
                    {
                        if ((data as {id_candidato: string}).id_candidato === candidateId)
                        {
                            foundExpedienteId = id;
                            setExpedienteId(id);

                            // Fetch notes if they exist
                            if ((data as any).notas)
                            {
                                setNotes((data as any).notas);
                            }

                            break;
                        }
                    }
                }

                if (!foundExpedienteId)
                {
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
                } else
                {
                    // If we found an expediente but haven't fetched the notes yet (rare case)
                    const expedienteNotasRef = ref(database, `expedientes/${foundExpedienteId}/notas`);
                    const notasSnapshot = await get(expedienteNotasRef);
                    if (notasSnapshot.exists())
                    {
                        setNotes(notasSnapshot.val());
                    } else
                    {
                        setNotes(""); // Set empty notes if not found
                    }
                }

                // 4. Obtener los datos del expediente
                const expedienteRef = ref(database, `expedientes/${foundExpedienteId}/documentos`);
                const expedienteSnapshot = await get(expedienteRef);

                // Si no hay documentos, inicializamos con valores por defecto
                if (!expedienteSnapshot.exists())
                {
                    setError('No se encontraron documentos en el expediente');
                    setLoading(false);
                    return;
                }

                // 5. Transformar los datos a la estructura esperada por el componente
                const expedienteData = expedienteSnapshot.val();
                const docsArray: Document[] = Object.entries(expedienteData).map(([docName, docData]: [string, any], index) =>
                {
                    // Campos array para el documento
                    const fieldsArray: ManualField[] = [];

                    if (docData.campos && typeof docData.campos === 'object')
                    {
                        Object.entries(docData.campos).forEach(([key, fieldData]) =>
                        {
                            fieldsArray.push({
                                key,
                                value: typeof fieldData === 'object' && fieldData !== null ? (fieldData as {valor: string}).valor : fieldData as string,
                                state: typeof fieldData === 'object' && fieldData !== null && 'estado' in fieldData
                                    ? mapDbStateToComponentState((fieldData as {estado: string}).estado)
                                    : DOCUMENT_STATES.REVIEWING,
                                label: formatFieldName(key)
                            });
                        });
                    } else
                    {
                        // Campos por defecto según el tipo de documento
                        switch (docName)
                        {
                            case 'ActaNacimiento':
                                fieldsArray.push(
                                    {key: 'fechaNacimiento', value: '', label: 'Fecha de Nacimiento', state: DOCUMENT_STATES.NOT_UPLOADED},
                                    {key: 'lugarExpedicion', value: '', label: 'Lugar de Expedición', state: DOCUMENT_STATES.NOT_UPLOADED}
                                );
                                break;
                            case 'CURP':
                                fieldsArray.push(
                                    {key: 'curpNumero', value: '', label: 'Número de CURP', state: DOCUMENT_STATES.NOT_UPLOADED}
                                );
                                break;
                            case 'INE':
                                fieldsArray.push(
                                    {key: 'claveElector', value: '', label: 'Clave de Elector', state: DOCUMENT_STATES.NOT_UPLOADED},
                                    {key: 'emision', value: '', label: 'Fecha de Emisión', state: DOCUMENT_STATES.NOT_UPLOADED}
                                );
                                break;
                            case 'CV':
                                fieldsArray.push(
                                    {key: 'experiencia', value: '', label: 'Años de Experiencia', state: DOCUMENT_STATES.NOT_UPLOADED},
                                    {key: 'educacion', value: '', label: 'Educación', state: DOCUMENT_STATES.NOT_UPLOADED}
                                );
                                break;
                        }
                    }

                    return {
                        id: index + 1,
                        name: docName,
                        fileState: mapDbStateToComponentState(docData.estadoArchivo || docData.estado || 'no_subido'),
                        fieldsState: mapDbStateToComponentState(docData.estadoCampos || docData.estado || 'no_subido'),
                        generalState: mapDbStateToComponentState(docData.estadoGeneral || docData.estado || 'no_subido'),
                        file: docData.url ? extractFileNameFromUrl(docData.url) : null,
                        fields: fieldsArray
                    };
                });

                setDocuments(docsArray);
                if (docsArray.length > 0)
                {
                    setSelectedDoc(docsArray[0].id);
                }

            } catch (err)
            {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar los datos del expediente');
            } finally
            {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Function to save notes
    const saveNotes = async () =>
    {
        if (!expedienteId) return;

        try
        {
            const docRef = ref(database, `expedientes/${expedienteId}/notas`);
            await set(docRef, notes);
        } catch (error)
        {
            console.error("Error saving notes:", error);
        }
    };

    // Handle notes textarea changes
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setNotes(e.target.value);
    };
    // Función auxiliar para extraer el nombre del archivo de una URL
    const extractFileNameFromUrl = (url: string): string =>
    {
        if (!url) return '';
        // Si url es algo como "pruebaInicial/archivo.pdf", extraemos "archivo.pdf"
        return url.split('/').pop() || url;
    };

    // Manejar carga de archivos
    const handleFileUpload = (fileName: string, snapshot: unknown) =>
    {
        // Actualizar el estado local
        setDocuments(prev =>
            prev.map(doc =>
                doc.id === selectedDoc
                    ? {...doc, file: fileName, generalState: DOCUMENT_STATES.REVIEWING}
                    : doc
            )
        );

        console.log("Archivo subido:", fileName, snapshot);
    };

    // Eliminar archivo
    const handleDeleteFile = (): void =>
    {
        // Actualizar el estado local
        setDocuments(documents.map(doc =>
            doc.id === selectedDoc
                ? {...doc, file: null, generalState: DOCUMENT_STATES.NOT_UPLOADED}
                : doc
        ));
    };

    // Actualizar campo manual sin guardarlo en la base de datos inmediatamente
    const handleFieldChange = (fieldKey: string, value: string): void =>
    {
        setDocuments(documents.map(doc =>
        {
            if (doc.id === selectedDoc)
            {
                // Copia el documento y actualiza el campo específico
                const updatedFields = doc.fields.map(field =>
                    field.key === fieldKey ? {...field, value} : field
                );

                return {
                    ...doc,
                    fields: updatedFields
                };
            }
            return doc;
        }));
    };

    // Nueva función para guardar todos los campos a la vez
    const handleSaveFields = (): void =>
    {
        if (!expedienteId || !currentDocument) return;

        // Crear un objeto con todos los campos para actualizar la base de datos
        const fieldsToSave: Record<string, string> = {};

        currentDocument.fields.forEach(field =>
        {
            fieldsToSave[field.key] = field.value;
        });

        // Referencia a la carpeta de campos del documento actual
        const camposRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}/campos`);

        // Actualizar todos los campos a la vez
        update(camposRef, fieldsToSave)
            .then(() =>
            {
                console.log(`Campos de ${currentDocument.name} actualizados`);
                alert("Se han guaradados los cambios exitosamente :)!")
            })
            .catch(err =>
            {
                console.error(`Error al actualizar campos:`, err);
            });
    };

    // Aprobar/Rechazar archivo
    const handleFileReview = async (approved: boolean) =>
    {
        if (!expedienteId || !currentDocument) return;

        const newState = approved ? 'aprobado' : 'rechazado';
        const message = approved ? "¿Aprobar este archivo?" : "¿Rechazar este archivo?";

        if (window.confirm(message))
        {
            // Actualizar estado local
            setDocuments(documents.map(doc =>
                doc.id === selectedDoc
                    ? {
                        ...doc,
                        fileState: approved ? DOCUMENT_STATES.APPROVED : DOCUMENT_STATES.REJECTED,
                        // Actualizar estado general
                        generalState: doc.fieldsState === DOCUMENT_STATES.APPROVED && approved
                            ? DOCUMENT_STATES.APPROVED
                            : DOCUMENT_STATES.REJECTED
                    }
                    : doc
            ));

            // Actualizar base de datos
            const docRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}`);
            update(docRef, {
                estadoArchivo: newState,
                estadoGeneral: currentDocument.fieldsState === DOCUMENT_STATES.APPROVED && approved
                    ? 'aprobado'
                    : 'rechazado'
            });

            alert(`Archivo ${approved ? "aprobado" : "rechazado"} exitosamente.`);
        }
    };

    // Aprobar/Rechazar un campo específico
    const handleFieldReview = async (fieldKey: string, approved: boolean) =>
    {
        if (!expedienteId || !currentDocument) return;

        const newState = approved ? 'aprobado' : 'rechazado';

        // Actualizar estado local del campo
        const updatedFields = [...currentDocument.fields];
        const fieldIndex = updatedFields.findIndex(f => f.key === fieldKey);
        if (fieldIndex !== -1)
        {
            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                state: approved ? DOCUMENT_STATES.APPROVED : DOCUMENT_STATES.REJECTED
            };
        }

        // Verificar si todos los campos están aprobados
        const allFieldsApproved = updatedFields.every(field => field.state === DOCUMENT_STATES.APPROVED);
        const newFieldsState = allFieldsApproved ? DOCUMENT_STATES.APPROVED : DOCUMENT_STATES.REJECTED;

        // Actualizar documento en el estado
        setDocuments(documents.map(doc =>
            doc.id === selectedDoc
                ? {
                    ...doc,
                    fields: updatedFields,
                    fieldsState: newFieldsState,
                    // Actualizar estado general
                    generalState: newFieldsState === DOCUMENT_STATES.APPROVED && doc.fileState === DOCUMENT_STATES.APPROVED
                        ? DOCUMENT_STATES.APPROVED
                        : DOCUMENT_STATES.REJECTED
                }
                : doc
        ));

        // Actualizar base de datos
        const fieldRef = ref(database,
            `expedientes/${expedienteId}/documentos/${currentDocument.name}/campos/${fieldKey}`);

        // Si es estructura antigua, actualizar a nueva estructura
        const fieldSnapshot = await get(fieldRef);
        if (fieldSnapshot.exists() && typeof fieldSnapshot.val() !== 'object')
        {
            const valor = fieldSnapshot.val();
            set(fieldRef, {
                valor: valor,
                estado: newState
            });
        } else
        {
            update(fieldRef, {
                estado: newState
            });
        }

        // Actualizar estados generales
        const docRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}`);
        update(docRef, {
            estadoCampos: allFieldsApproved ? 'aprobado' : 'rechazado',
            estadoGeneral: allFieldsApproved && currentDocument.fileState === DOCUMENT_STATES.APPROVED
                ? 'aprobado'
                : 'rechazado'
        });
    };
    
    // Función para aprobar todo (archivo y campos)
    const handleApproveAll = async () =>
    {
        if (!expedienteId || !currentDocument) return;

        if (window.confirm("¿Estás seguro de que deseas APROBAR este documento y TODOS sus campos?"))
        {
            try
            {
                // 1. Actualizar estado local
                const updatedFields = currentDocument.fields.map(field => ({
                    ...field,
                    state: DOCUMENT_STATES.APPROVED
                }));

                setDocuments(documents.map(doc =>
                    doc.id === selectedDoc
                        ? {
                            ...doc,
                            fileState: DOCUMENT_STATES.APPROVED,
                            fieldsState: DOCUMENT_STATES.APPROVED,
                            generalState: DOCUMENT_STATES.APPROVED,
                            fields: updatedFields
                        }
                        : doc
                ));

                // 2. Actualizar base de datos - estado general del documento
                const docRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}`);
                await update(docRef, {
                    estadoArchivo: 'aprobado',
                    estadoCampos: 'aprobado',
                    estadoGeneral: 'aprobado'
                });

                // 3. Actualizar cada campo en la base de datos - estructura nueva simplificada
                for (const field of currentDocument.fields)
                {
                    const fieldRef = ref(database,
                        `expedientes/${expedienteId}/documentos/${currentDocument.name}/campos/${field.key}`);

                    await update(fieldRef, {
                        estado: 'aprobado'
                    });
                }

                alert("✅ ¡Documento y todos sus campos aprobados exitosamente!");
            } catch (error)
            {
                console.error("Error al aprobar todo:", error);
                alert("Ocurrió un error al intentar aprobar todo.");
            }
        }
    };

    // Función para rechazar todo (archivo y campos)
    const handleRejectAll = async () =>
    {
        if (!expedienteId || !currentDocument) return;

        if (window.confirm("¿Estás seguro de que deseas RECHAZAR este documento y TODOS sus campos?"))
        {
            try
            {
                // 1. Actualizar estado local
                const updatedFields = currentDocument.fields.map(field => ({
                    ...field,
                    state: DOCUMENT_STATES.REJECTED
                }));

                setDocuments(documents.map(doc =>
                    doc.id === selectedDoc
                        ? {
                            ...doc,
                            fileState: DOCUMENT_STATES.REJECTED,
                            fieldsState: DOCUMENT_STATES.REJECTED,
                            generalState: DOCUMENT_STATES.REJECTED,
                            fields: updatedFields
                        }
                        : doc
                ));

                // 2. Actualizar base de datos - estado general del documento
                const docRef = ref(database, `expedientes/${expedienteId}/documentos/${currentDocument.name}`);
                await update(docRef, {
                    estadoArchivo: 'rechazado',
                    estadoCampos: 'rechazado',
                    estadoGeneral: 'rechazado'
                });

                // 3. Actualizar cada campo en la base de datos - estructura nueva simplificada
                for (const field of currentDocument.fields)
                {
                    const fieldRef = ref(database,
                        `expedientes/${expedienteId}/documentos/${currentDocument.name}/campos/${field.key}`);

                    await update(fieldRef, {
                        estado: 'rechazado'
                    });
                }

                alert("❌ Documento y todos sus campos han sido rechazados.");
            } catch (error)
            {
                console.error("Error al rechazar todo:", error);
                alert("Ocurrió un error al intentar rechazar todo.");
            }
        }
    };
    // Encontrar el documento seleccionado
    const currentDocument = documents.find(doc => doc.id === selectedDoc);

    if (loading)
    {
        return <div className="p-6 text-center">Cargando datos del expediente...</div>;
    }

    if (error)
    {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <>
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
                                <StateIcon state={doc.generalState} />

                                <div className="flex-1 h-1 bg-gray-200 relative">
                                    <div
                                        className={`absolute top-0 left-0 h-full ${doc.generalState === DOCUMENT_STATES.APPROVED
                                            ? 'bg-green-500'
                                            : doc.generalState === DOCUMENT_STATES.REVIEWING
                                                ? 'bg-yellow-500'
                                                : doc.generalState === DOCUMENT_STATES.REJECTED
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
                <div className="w-1/2 bg-gray-50 p-4 overflow-y-auto" style={{maxHeight: "90vh"}}>
                    {currentDocument && (
                        <>
                            {/* Visualización del archivo */}
                            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                                <h3 className="font-medium text-lg mb-3">
                                    <div className="flex items-center justify-between">
                                        <span>Documento PDF</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentDocument.fileState === DOCUMENT_STATES.APPROVED
                                            ? 'bg-green-100 text-green-800'
                                            : currentDocument.fileState === DOCUMENT_STATES.REVIEWING
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : currentDocument.fileState === DOCUMENT_STATES.REJECTED
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {currentDocument.fileState === DOCUMENT_STATES.APPROVED
                                                ? 'Aprobado'
                                                : currentDocument.fileState === DOCUMENT_STATES.REVIEWING
                                                    ? 'Pendiente'
                                                    : currentDocument.fileState === DOCUMENT_STATES.REJECTED
                                                        ? 'Rechazado'
                                                        : 'No subido'}
                                        </span>
                                    </div>
                                </h3>

                                {currentDocument.file ? (
                                    <div>
                                        <ManagerViewer
                                            expedienteId={expedienteId || undefined}
                                            documentoId={currentDocument.name}
                                            fileName={currentDocument.file}
                                            folder="pruebaInicial"
                                            onFileDeleted={handleDeleteFile}
                                            userRole="RH"
                                        />

                                        {/* Botones de revisión del archivo */}
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <h4 className="font-medium mb-2">Revisión del archivo PDF:</h4>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleFileReview(true)}
                                                    className={`flex items-center px-3 py-2 rounded transition-colors ${currentDocument.fileState === DOCUMENT_STATES.APPROVED
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    <ThumbsUp size={16} className="mr-2" />
                                                    {currentDocument.fileState === DOCUMENT_STATES.APPROVED ? 'Aprobado' : 'Aprobar'}
                                                </button>

                                                <button
                                                    onClick={() => handleFileReview(false)}
                                                    className={`flex items-center px-3 py-2 rounded transition-colors ${currentDocument.fileState === DOCUMENT_STATES.REJECTED
                                                        ? 'bg-red-200 text-red-800'
                                                        : 'bg-red-600 text-white hover:bg-red-700'
                                                        }`}
                                                >
                                                    <ThumbsDown size={16} className="mr-2" />
                                                    {currentDocument.fileState === DOCUMENT_STATES.REJECTED ? 'Rechazado' : 'Rechazar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <X size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500">El candidato aún no ha subido este documento</p>
                                    </div>
                                )}
                            </div>

                            {/* Campos del documento */}
                            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-lg">Datos del documento</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentDocument.fieldsState === DOCUMENT_STATES.APPROVED
                                        ? 'bg-green-100 text-green-800'
                                        : currentDocument.fieldsState === DOCUMENT_STATES.REVIEWING
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : currentDocument.fieldsState === DOCUMENT_STATES.REJECTED
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {currentDocument.fieldsState === DOCUMENT_STATES.APPROVED
                                            ? 'Campos aprobados'
                                            : currentDocument.fieldsState === DOCUMENT_STATES.REVIEWING
                                                ? 'Campos pendientes'
                                                : currentDocument.fieldsState === DOCUMENT_STATES.REJECTED
                                                    ? 'Campos rechazados'
                                                    : 'Sin datos'}
                                    </span>
                                </div>

                                {currentDocument.fields.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentDocument.fields.map((field) => (
                                            <div key={field.key} className="border border-gray-200 rounded-md p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.label}
                                                    </label>
                                                    <div className="flex space-x-1">
                                                        <button
                                                            onClick={() => handleFieldReview(field.key, true)}
                                                            className={`p-1.5 rounded transition-colors ${field.state === DOCUMENT_STATES.APPROVED
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700'
                                                                }`}
                                                            title="Aprobar campo"
                                                        >
                                                            <ThumbsUp size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFieldReview(field.key, false)}
                                                            className={`p-1.5 rounded transition-colors ${field.state === DOCUMENT_STATES.REJECTED
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700'
                                                                }`}
                                                            title="Rechazar campo"
                                                        >
                                                            <ThumbsDown size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        className={`w-full p-2 border rounded ${field.state === DOCUMENT_STATES.APPROVED
                                                            ? 'border-green-300 bg-green-50'
                                                            : field.state === DOCUMENT_STATES.REJECTED
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-300'
                                                            }`}
                                                        value={field.value}
                                                        readOnly
                                                    />
                                                    <span className={`ml-2 p-1 rounded-full ${field.state === DOCUMENT_STATES.APPROVED
                                                        ? 'bg-green-500'
                                                        : field.state === DOCUMENT_STATES.REJECTED
                                                            ? 'bg-red-500'
                                                            : field.state === DOCUMENT_STATES.REVIEWING
                                                                ? 'bg-yellow-500'
                                                                : 'bg-gray-300'
                                                        }`}>
                                                        {field.state === DOCUMENT_STATES.APPROVED
                                                            ? <Check size={12} className="text-white" />
                                                            : field.state === DOCUMENT_STATES.REJECTED
                                                                ? <X size={12} className="text-white" />
                                                                : field.state === DOCUMENT_STATES.REVIEWING
                                                                    ? <Clock size={12} className="text-white" />
                                                                    : <X size={12} className="text-white" />
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500">No hay datos disponibles para este documento</p>
                                    </div>
                                )}
                            </div>

                            {/* Notas del documento */}
                            <div className="p-4 bg-white rounded-lg shadow-sm">
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
                            {/* Botones para aprobar/rechazar todo */}
                            <div className="mt-3 flex space-x-3 justify-start">
                                <button
                                    onClick={handleApproveAll}
                                    className="flex items-center px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    disabled={!currentDocument.file || currentDocument.fields.length === 0}
                                >
                                    <Check size={16} className="mr-2" />
                                    Aprobar Todo
                                </button>
                                <button
                                    onClick={handleRejectAll}
                                    className="flex items-center px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    disabled={!currentDocument.file || currentDocument.fields.length === 0}
                                >
                                    <X size={16} className="mr-2" />
                                    Rechazar Todo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExpedienteCandidato;