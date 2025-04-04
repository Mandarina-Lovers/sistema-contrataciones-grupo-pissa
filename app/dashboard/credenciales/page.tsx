import CreateCredentials from "@/app/components/createcredentials";


export default function Credentials() {
  
    return (
        <div className="overflow-y-auto p-8 mt-16 md:mt-0 flex-col flex">
            <h2 className="mb-4 flex-1 text-xl font-semibold text-black">Creación de Credenciales</h2>
            <CreateCredentials/>
        </div>
    )
}

