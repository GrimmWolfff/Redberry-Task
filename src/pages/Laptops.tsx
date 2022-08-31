import { useState, useEffect } from "react";

interface Laptop {
    user: {
        name: string,
        surname: string,
    },
    laptop: {
        image: string,
        name: string,
        id: number
    }
}
export default function Laptops() {
    const [Laptops, SetLaptops] = useState<Laptop[]>();
    useEffect(() => {
        async function GetLaptops() {
            const response = await fetch(`${import.meta.env.VITE_URL}/laptops?token=${import.meta.env.VITE_TOKEN}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            SetLaptops(data.data);
        }
        GetLaptops();
    }, [])
    return (
        <div className="absolute w-7/12 h-full flex flex-col gap-[3rem] items-center p-4">
            <h1 className="top-0 text-black font-bold text-3xl">ლეპტოპის ინფო</h1>
            <div className="grid md:grid-cols-2 grid-cols-2 gap-20">
                {Laptops && Laptops.map((laptop:Laptop, idx: number) => (
                    <div key={idx} className="flex md:flex-row flex-col h-[205px] w-[500px] bg-[#EAFAFF] m-0
                    border border-2 border-[#AED1EA] rounded-xl">
                        <img src={`https://pcfy.redberryinternship.ge${laptop?.laptop?.image}`} alt="..." className="w-1/2 p-4 h-full"/>
                        <div className="flex flex-col justify-evenly items-start p-2">
                            <p>{laptop.user.name} {laptop.user.surname}</p>
                            <p>{laptop.laptop.name}</p>
                            <br />
                            <a href={`/laptop/${laptop.laptop.id}`} 
                            className="text-[#AED1EA] font-bold">მეტის ნახვა</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}