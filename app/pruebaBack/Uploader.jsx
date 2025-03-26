'use client'

import {ref, uploadBytes} from 'firebase/storage'
import React from 'react'
import { storage } from '../../firebaseConfig.ts'

const Uploader = () => {
    const inputRef = React.useRef(null);

    const handleUpload = async e => {

        e.preventDefault();
        const file = inputRef.current.files[0]
        console.log(file)
        
        try{
            const fileRef = ref(storage , `pruebaInicial/${file.name}`)
            const snapshot = await uploadBytes(fileRef, file)
            console.log('Uploaded a blob or file!', snapshot)
        } catch(error) {
            console.log(error)
        }

    }

    return (
        <div>
            <form onSubmit={handleUpload}>
                <br/>
                <input ref={inputRef} type='file' name='file'/>
                <br/>
                <button type='submit'>Cargar archivo</button>
            </form>
        </div>
    )
}

export default Uploader;