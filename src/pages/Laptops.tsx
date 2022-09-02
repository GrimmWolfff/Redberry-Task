import { useState, useEffect } from "react";
import type { SingleLaptopType } from "../types";
import { motion } from "framer-motion";

export default function Laptops() {
    const [Laptops, SetLaptops] = useState<SingleLaptopType[]>();
    
    useEffect(() => {
        async function GetLaptops() {
            const response = await fetch(`${import.meta.env.VITE_URL}/laptops?token=3803949bbbced161d9ae347037734b4a`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            SetLaptops(data.data);
        }
        GetLaptops();
    }, []);

    return (
        <div className="w-full md:w-7/12 flex flex-col min-h-screen mb-4 gap-[3rem] justify-around md:justify-start items-center p-4">
            <h1 className="top-0 text-black font-bold text-3xl mt-4 md:mt-0">ლეპტოპის ინფო</h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="flex flex-col w-full md:grid md:grid-cols-2 md:gap-10">
                {Laptops && Laptops.map((laptop:SingleLaptopType, idx: number) => (
                    <div key={idx} className="flex md:flex-row h-[20%] w-full md:h-[205px] md:w-[500px] bg-[#EAFAFF] mb-2 md:mb-0
                    border border-2 border-[#AED1EA] rounded-xl">
                        <img src={`https://pcfy.redberryinternship.ge${laptop?.laptop?.image}`} alt="..." className="w-1/2 p-4 h-full"/>
                        <div className="flex flex-col justify-evenly items-start p-2">
                            <p>{laptop?.user.name} {laptop.user.surname}</p>
                            <p>{laptop?.laptop.name}</p>
                            <br />
                            <a href={`/laptop/${laptop.laptop.id}`} 
                            className="text-[#AED1EA] font-bold">მეტის ნახვა</a>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}