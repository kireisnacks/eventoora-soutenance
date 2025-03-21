"use client";

import { Search } from "lucide-react";

const SearchFilters = () => {
    return (
        <div className="h-[48px] lg:h-[64px] flex flex-row items-center justify-between border rounded-full bg-white shadow-lg">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between">
                    <div className="cursor-pointer w-[200px] h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-l-full hover:bg-gray-100">
                        <p className="text-xs font-semibold">Qu'avez vous en tête?</p>
                        <p className="text-sm">Choisissez l'activité</p>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-300" />

                    <div className="cursor-pointer w-[200px] h-[48px] lg:h-[64px] px-8 flex flex-col justify-center hover:bg-gray-100">
                        <p className="text-xs font-semibold">Où?</p>
                        <p className="text-sm">Choisissez le lieu</p>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-300" />

                    <div className="cursor-pointer w-[200px] h-[48px] lg:h-[64px] px-8 flex flex-col justify-center hover:bg-gray-100 group">
                        <p className="text-xs font-semibold">Quand?</p>
                        <p className="text-sm">N'importe quand ?</p>
                    </div>
                </div>  
            </div>    

            <div className="p-2">
                <div className="cursor-pointer p-2 lg:p-4 bg-eventoora hover:bg-eventoora-dark transition rounded-full text-white">
                    <Search />
                </div>
            </div>
        </div>
    )
}

export default SearchFilters;
