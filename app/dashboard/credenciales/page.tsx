'use client';
import React, {useState} from "react";
import {post2DB} from '../../../post2DB'
import { set, ref, get } from "firebase/database";
import {database} from '../../../firebaseConfig'
import {generatePassword} from '../../../createSecurePassword'

const Credentials = () => {
  

  const [name, setname] = useState("");
  const [lastname, setlastname] = useState("");
  const [mail, setmail] = useState("");
  const [phone, setphone] = useState("");
  const [role, setrole] = useState("");
  
  const handlePress = async () => {
  
    var children_num =  (await get(ref(database, "usuarios"))).size;
    children_num++;
    var nodename = "user" + children_num + "/";

    console.log('usuarios/' + nodename);

    var data = {

      apellidos: lastname,
      email: mail,
      estadoUsuario: "normal",
      nombre: name,
      rol: role,
      telefono: phone,
      contraseña: generatePassword()

    }

    await post2DB('usuarios/' + nodename, data).then(() => {
      alert("Se han creado las credenciales exitosamente");
    });
    


  }
  
  return (
    <div className="w-400  mt-15 flex justify-center">
      <div className="w-full max-w-sm flex flex-col text-center p-4 bg-white rounded-lg shadow-md">
        
        <h1 className="text-black text-lg font-semibold">Nombre</h1>
        <input type="text" className="text-black border border-gray-300 rounded p-2 w-full" value={name} onChange={(event) => {setname(event.target.value)}}/>

        <div className="text-black mt-4 ">Apellidos</div>
        <input type="text" className="text-black border border-gray-300 rounded p-2 w-full" value={lastname} onChange={(event) => {setlastname(event.target.value)}}/>

        <div className="text-black mt-4">Correo</div>
        <input type="text" className="text-black border border-gray-300 rounded p-2 w-full" value={mail} onChange={(event) => {setmail(event.target.value)}}/>

        <div className="text-black mt-4">Teléfono</div>
        <input type="text" className="text-black border border-gray-300 rounded p-2 w-full" value={phone} onChange={(event) => {setphone(event.target.value)}}/>

        
        <div className="text-black mt-4">Tipo de Usuario</div>
        
        <div className="flex-col">
        <p className="text-black mt-4">Candidato</p>
        <input type="checkbox" value ="candidato" onChange={(event) => {setrole(event.target.value)}}/>
        <p className="text-black mt-4">RH</p>
        <input type="checkbox" disabled value="rh" onChange={(event) => {setrole(event.target.value)}}></input>
        </div>
      
        <button className="bg-blue-700 hover:bg-blue-800 active:bg-blue-1000 p-2 rounded border-none text-white px-6 py-5 text-center text-lg inline-block m-1 " onClick={() => handlePress()}>
        Crear Credenciales
        </button>

      </div>    
      
    
    </div>

    
  );
}



export default Credentials;
