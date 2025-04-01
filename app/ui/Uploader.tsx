
'use client'
import { ref, uploadBytes } from 'firebase/storage'
import React, { useRef } from 'react'
import { storage } from '../../firebaseConfig'
import { Upload } from 'lucide-react'

// Definimos las props que puede recibir Uploader
interface UploaderProps {
  onFileUploaded?: (fileName: string, snapshot: unknown) => void
}

const Uploader: React.FC<UploaderProps> = ({ onFileUploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return

    console.log("Archivo seleccionado:", file)

    try {
      const fileRef = ref(storage, `pruebaInicial/${file.name}`)
      const snapshot = await uploadBytes(fileRef, file)
      console.log("Archivo subido correctamente:", snapshot)

      // Se llama al callback y se le pasan los parámetros
      if (onFileUploaded) {
        onFileUploaded(file.name, snapshot)
      }
    } catch (error) {
      console.log("Error al subir el archivo", error)
    }
  }

  return (
    <div>
      <label className="cursor-pointer">
        <div className="bg-blue-900 text-white p-8 rounded-lg inline-block mb-2">
          <Upload size={32} />
        </div>
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept=".pdf" 
          onChange={handleUpload}
        />
      </label>
    </div>
  )
}

export default Uploader