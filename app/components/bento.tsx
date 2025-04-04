import { Users } from "lucide-react";
import CountUsers from "./countusers";

export default function Bento () {
    return(

        <div className="md:grid md:grid-cols-3 md:grid-rows-3 gap-4 w-full h-full flex flex-col">
            <div className="bg-white rounded-xl border-gray-300 border justify-center flex flex-col p-15 hover:scale-105 shadow-md transition-transform transform">
                <div className="bg-[#f4a261] rounded-4xl p-4 w-14">
                    <Users/>
                </div>
                <p className="pt-4 text-sm  text-[#495057]">Total de usuarios</p>
                <CountUsers/>
            </div>
            <div className="bg-gray-300 rounded-xl"></div>
            <div className="bg-gray-300 rounded-xl"></div>
            <div className="col-span-3 row-span-2 row-start-2 bg-gray-300 rounded-xl"></div>
        </div> 
    
    )
}