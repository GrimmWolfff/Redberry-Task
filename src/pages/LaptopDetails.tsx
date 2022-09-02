import { useEffect, useState } from 'react';
import type { FullLaptop } from '../types';

//* Image
import backArrow from '../assets/less-than-symbol.png';

//? Laptop Details Page

export default function LaptopDetails(): JSX.Element {
    const [Laptop, SetLaptop] = useState<FullLaptop>();

    useEffect(() => {
        async function GetLaptop() {
            const id = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
            const response = await fetch(`${import.meta.env.VITE_URL}/laptop/${id}?token=3803949bbbced161d9ae347037734b4a`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            SetLaptop(data.data);
            console.log(data)
        };
        GetLaptop();
    }, [])

    return (
        <div className="absolute w-full md:w-7/12 h-full flex flex-col gap-[2rem] items-center p-0 md:p-4">
            {window.screen.width > 600 
            ?   <h1 className="top-0 text-black font-bold text-3xl">ლეპტოპის ინფო</h1>
            :   (
                <div className="w-full flex flex-row justify-between items-center">
                    <img src={backArrow} alt="..." className={`w-10 h-10 rounded-full`}
                    onClick={() => location.assign('/my-laptops')} />
                    <h1 className="top-0 text-black font-bold text-3xl w-full">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ლეპტოპის ინფო</h1>
                </div>
                )
            }
            <div className="flex md:flex-row flex-col justify-center items-center w-full h-auto md:h-[40vh] pb-10 border-b border-1 border-black">
                <img src={`https://pcfy.redberryinternship.ge${Laptop?.laptop?.image}`} alt="..." 
                className="w-full md:md: h-full" />
                <div className="flex flex-col w-full md:w-1/2 p-4 md:p-10 h-full justify-evenly">
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">სახელი:</strong> {Laptop?.user?.name}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">გვარი:</strong> {Laptop?.user?.surname}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">პოზიცია:</strong> {Laptop?.user?.position_id}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">თიმი:</strong> {Laptop?.user?.team_id}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">მეილი:</strong> {Laptop?.user?.email}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">ტელ.ნომერი:</strong> {Laptop?.user?.phone}</p>
                </div>
            </div>
            <div className='w-full h-auto pb-10 md:h-[30vh] flex flex-col md:flex-row justify-between items-center border-b border-1 border-black'>
                <div className="w-full md:w-5/12 flex flex-col p-4 md:p-10 h-full justify-evenly gap-2">
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">ლეპტოპის სახელი:</strong> {Laptop?.laptop?.name}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">ლეპტოპის ბრენდი:</strong> {Laptop?.laptop?.brand_id}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">RAM:</strong> {Laptop?.laptop?.ram}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">მეხსიერების ტიპი:</strong> {Laptop?.laptop?.hard_drive_type}</p>
                </div>
                <div className="w-1/6 md:flex hidden"></div>
                <div className="w-full md:w-5/12 flex flex-col p-4 md:p-10 h-full justify-evenly gap-2">
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">CPU:</strong> {Laptop?.laptop?.cpu?.name}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">CPU-ს ბირთვი:</strong> {Laptop?.laptop?.cpu?.cores}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">CPU-ს ნაკადი:</strong> {Laptop?.laptop?.cpu?.threads}</p>
                </div>
            </div>
            <div className='w-full h-auto md:h-1/3 flex flex-col md:flex-row justify-between items-start md:items-center'>
                <div className="w-full  md:w-5/12 flex flex-col p-4 md:p-10 h-full justify-evenly gap-2">
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">ლეპტოპის სახელი:</strong> {Laptop?.laptop?.name}</p>
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">ლეპტოპის ბრენდი:</strong> {Laptop?.laptop?.brand_id}</p>
                </div>
                <div className="w-1/6 md:flex hidden"></div>
                <div className="w-full md:w-5/12 flex flex-col p-4 md:p-10 h-full justify-evenly gap-2">
                    <p className="text-[#797979] text-xl flex flex-row justify-between"><strong className="text-black">CPU:</strong> {Laptop?.laptop?.cpu?.name}</p>
                </div>
            </div>
        </div>
    );
}