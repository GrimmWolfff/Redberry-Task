import { useEffect, useState } from 'react';

interface Laptop {
    user: {
        name: string,
        surname: string,
        email: string,
        phone: string,
        position_id: number,
        team_id: number
    },
    laptop: {
        image: string,
        name: string,
        id: number,
        cpu: string,
        core: number,
        thread: number,
        brand: string,
        ram: number,
        hard_drive_type: string,
        state: string,
        price: number,
        date: string
    }
}

export default function LaptopDetails(): JSX.Element {
    const [Laptop, SetLaptop] = useState<Laptop>();

    useEffect(() => {
        async function GetLaptop() {
            const id = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
            const response = await fetch(`${import.meta.env.VITE_URL}/laptop/${id}?token=${import.meta.env.VITE_TOKEN}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            SetLaptop(data.data);
        };
        GetLaptop();
    }, [])
    console.log(Laptop)
    return (
        <div className="absolute w-7/12 h-full flex flex-col gap-[3rem] items-center p-4">
            <h1 className="top-0 text-black font-bold text-3xl">ლეპტოპის ინფო</h1>
            <div className="flex md:flex-row flex-col justify-center items-center w-full h-[40vh] pb-10 border-b border-1 border-black">
                <img src={`https://pcfy.redberryinternship.ge${Laptop?.laptop?.image}`} alt="..." className="w-1/2 h-full p-4" />
                <div className="flex flex-col w-1/2 p-10 h-full justify-evenly">
                    <p><strong>სახელი:</strong> {Laptop?.user?.name}</p>
                    <p><strong>გვარი:</strong> {Laptop?.user?.surname}</p>
                    <p><strong>პოზიცია:</strong> {Laptop?.user?.position_id}</p>
                    <p><strong>თიმი:</strong> {Laptop?.user?.team_id}</p>
                    <p><strong>მეილი:</strong> {Laptop?.user?.email}</p>
                    <p><strong>ტელ.ნომერი:</strong> {Laptop?.user?.phone}</p>
                </div>
            </div>
        </div>
    );
}