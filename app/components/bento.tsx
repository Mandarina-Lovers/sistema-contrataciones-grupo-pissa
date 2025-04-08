import { UserPlus, Users } from "lucide-react";
import CountUsers from "./countusers";
import CantCandidatos from "./cantidad-candidatos";

export default function Bento () {
    return(        
        <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full h-full">
            <div className="bg-white rounded-xl p-6 shadow-md flex flex-row justify-center items-center gap-8">
                <div className="bg-[#f4a261] rounded-full p-4 text-white">
                    <Users/>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-[#495057]">Total de empleados</h2>
                    <CountUsers/>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md flex flex-row justify-center items-center gap-8">
                <div className="bg-[#42b883] rounded-full p-4 text-white">
                    <UserPlus/>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-[#495057]">Total de candidatos</h2>
                    <CantCandidatos/>
                </div>
            </div>
            <div className="bg-gray-300 rounded-xl"></div>
            <div className="bg-gray-300 rounded-xl col-span-3 row-span-4 col-start-1 row-start-2"></div>
            <div className="bg-gray-300 rounded-xl row-span-4 col-start-4 row-start-2"></div>
            <div className="bg-gray-300 rounded-xl col-start-4 row-start-1"></div>
        </div>   
    )
}