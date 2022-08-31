import { FormEvent, useEffect, useState, useRef, ChangeEvent } from "react";
import { usePersistentStorageValue, LocalStorage } from "../hooks/localStorage";
import { motion } from 'framer-motion';
import type { CPU, Laptop, User } from "../types";
import { Buffer } from 'buffer';

const localstorage = new LocalStorage();

export default function NewLaptop(): JSX.Element {
    const [Brands, setBrands] = useState<Laptop[]>([]);
    const [CPUS, setCPUS] = useState<CPU[]>([]);

    const [error, setError] = useState({
        lname: false,
        cpu: false,
        brand: false,
        hertz: false,
        thread: false,
        ram: false,
        date: false,
        price: false
    });

    const [Brand, setBrand] = usePersistentStorageValue("brand", '');
    const [Lname, setLname] = usePersistentStorageValue("lname", '');
    const [Cpu, setCpu] = usePersistentStorageValue("cpu", '');
    const [Hertz, setHertz] = usePersistentStorageValue("hertz", '');
    const [Thread, setThread] = usePersistentStorageValue("thread", '');
    const [Price, setPrice] = usePersistentStorageValue("price", '');
    const [Date, setDate] = usePersistentStorageValue("date", '');
    const [Ram, setRam] = usePersistentStorageValue("ram", '');
    const [Condition, SetCondition] = usePersistentStorageValue('condition', '');
    const [HardDriveType, SetHardDriveType] = usePersistentStorageValue('hardDriveType', '');
    const [Image, SetImage] = useState<string | null | WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }>();

    const brandRef = useRef<HTMLSelectElement>(null);
    const lnameRef = useRef<HTMLInputElement>(null);
    const cpuRef = useRef<HTMLSelectElement>(null);
    const hertzRef = useRef<HTMLInputElement>(null);
    const threadRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const ramRef = useRef<HTMLInputElement>(null);
    const conditionRef = useRef<HTMLInputElement>(null);
    const harddriveRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        async function GetBrands() {
            const response = await fetch(`${import.meta.env.VITE_URL}/brands`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            setBrands(data.data);
        }
        async function GetCPUS() {
            const response = await fetch(`${import.meta.env.VITE_URL}/cpus`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            setCPUS(data.data);
        }
        GetBrands();
        GetCPUS();

        if (cpuRef.current) cpuRef.current.selectedIndex = +Cpu;
        if (brandRef.current) brandRef.current.selectedIndex = +Brand;
        if (lnameRef.current) lnameRef.current.value = Lname;
        if (hertzRef.current) hertzRef.current.value = Hertz;
        if (threadRef.current) threadRef.current.value = Thread;
        if (dateRef.current) dateRef.current.value = Date;
        if (ramRef.current) ramRef.current.value = Ram;
        if (priceRef.current) priceRef.current.value = Price;
        if (hertzRef.current) hertzRef.current.value = Hertz;
        if (conditionRef.current) conditionRef.current.value = Condition;
        if (harddriveRef.current) harddriveRef.current.value = HardDriveType;

    }, []);

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target || !e.target.files || !e.target.files[0]) {
            return;
        }
        const [file] = e.target.files;
        SetImage(URL.createObjectURL(file));
        // SetImage(e.target.files[0])
        // const reader = new FileReader();
        // let f = e.target.files[0];
        // reader.onloadend = function() {
        //     setPreviewImage(reader.result);
        // }
        // reader.readAsDataURL(f);
    }

    const handleChange = (e: FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        if(!brandRef.current 
            || !lnameRef.current 
            || !cpuRef.current 
            || !threadRef.current 
            || !dateRef.current 
            || !hertzRef.current 
            || !ramRef.current 
            || !priceRef.current) { return; }

            if(lnameRef.current.value.length && !/^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g.test(lnameRef.current.value))
                setError(old => ({...old, lname: true }));
            if(threadRef.current.value.length && !/^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g.test(threadRef.current.value))
                setError(old => ({...old, thread: true }));
            if(hertzRef.current.value.length && !/^[0-9]+$/g.test(hertzRef.current.value))
                setError(old => ({...old, hertz: true }));
            if(priceRef.current.value.length && !/^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g.test(priceRef.current.value))
                setError(old => ({...old, price: true }));
            if(ramRef.current.value.length && !/^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g.test(ramRef.current.value))
                setError(old => ({...old, ram: true }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, surname, team_id, position_id, email, phone_number }:User = await localstorage.getItem('user');

        const headers = { 'Content-Type': 'multipart/form-data' };
        if(!Image) {
            return;
        }
        console.log(Buffer.from(Image).toString('base64'));
        const res = JSON.stringify({
            name: name, surname: surname,
            team_id: +team_id,
            position_id: +position_id,
            email: email,
            phone_number: phone_number,
            laptop_name: Lname, 
            laptop_brand_id: +Brand, 
            laptop_cpu: Cpu, 
            laptop_cpu_cores: +Hertz, 
            laptop_cpu_threads: +Thread,
            laptop_purchase_date: Date, 
            laptop_price: +Price,
            laptop_ram: +Ram,
            laptop_image: Buffer.from(Image).toString('base64'),
            laptop_hard_drive_type: HardDriveType,
            laptop_state: Condition,
            token: "3803949bbbced161d9ae347037734b4a"
            //3803949bbbced161d9ae347037734b4a
        });
        try {
            if(!Object.entries(error).filter(arr => arr[1] === true).length) {
                const response = await fetch(`${import.meta.env.VITE_URL}/laptop/create`, {
                    method: 'POST',
                    headers,
                    body: res
                });
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <motion.form method="POST" className="min-h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mt-4 bg-white
            2xl:pt-16 2xl:pr-36 2xl:pl-36 2xl:pb-10 2xl:mb-24" onChange={handleChange} onSubmit={handleSubmit}
            initial={{ x: -1000 }} animate={{ x: 0 }} transition={{ duration: 0.5 }} encType='multipart/form-data'>
            {Image ?
                <div className="bg-[#F7F7F7] w-full flex flex-col items-center justify-center
                border-dashed border-2 border-[#4386A9] rounded-x">
                    <img className="h-[20vh] p-4" src={String(Image)} alt="Error" />
                    <div className="inline-flex w-full justify-evenly">
                        <label htmlFor="files" className="w-40 text-center
                        right-0 rounded-sm p-4 bg-[#62A1EB] text-white">შეცვლა</label>
                        <input type="button" onClick={() => SetImage(null)} value="წაშლა"
                        className="w-40 text-center right-0 rounded-sm p-4 bg-red-600 text-white" />
                    </div>
                    <input onChange={e => handleSelectFile(e)} id="files" className="invisible" type="file" />    
                </div>
                : (
                <div className="flex flex-col items-center justify-center bg-[#F7F7F7] h-[30vh] w-full
                border-dashed border-2 border-[#4386A9] rounded-xl">
                    <p className="text-[#4386A9] text-center">ჩააგდე ან ატვირთე <br /> ლეპტოპის ფოტო</p>
                    <><br /><br /></>
                    <label htmlFor="files" className="w-40 text-center
                    right-0 rounded-sm p-4 bg-[#62A1EB] text-white">ატვირთე</label>
                    <input onChange={e => handleSelectFile(e)} id="files" className="invisible" type="file" />    
                </div>
            
            )
            }
            <div className="h-[16vh] border-b border-1 border-[#C7C7C7] w-full 
            flex flex-row justify-between items-center">
                <div className="flex flex-col md:w-5/12 w-full">
                    <label htmlFor="lname" className="font-semibold">ლეპტოპის სახელი </label>                    
                    <input required
                    onChange={e => {
                        setLname(e.target.value);
                        setError(old => ({...old, lname: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={lnameRef} 
                    id="lname" type="text" placeholder="HP" 
                    className={`${!error.lname ? 'border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400'
                    : 'border-red-500 focus:outline-none'} w-full rounded-md
                    mt-2 mb-2 p-2 border border-5`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">ლათინური ასოები, ციფრები, !@#$%^&*()_+= </sub>
                </div>

                <select required ref={brandRef} defaultValue="ლეპტოპის ბრენდი" onChange={e => setBrand(String(e.target.selectedIndex))} 
                    className="w-5/12 bg-[#EBEBEB] font-semibold rounded-lg p-[1rem] text-sm mt-4 mb-4 ra-select
                    focus:outline-none">
                        <option disabled hidden value="ლეპტოპის ბრენდი">ლეპტოპის ბრენდი</option>
                        {Brands.map((brand: Laptop, index: number) => (
                            <option key={index}>{brand.name}</option>
                        ))}
                </select>
            </div>

            <div className="gap-5 h-[16vh] w-full flex flex-row justify-between items-center">
            
                <select required ref={cpuRef} defaultValue="CPU" onChange={e => setCpu(String(e.target.selectedIndex))} 
                    className="md:w-1/3 w-full bg-[#EBEBEB] font-semibold rounded-lg p-[0.7rem] text-sm ra-select focus:outline-none mt-2">
                    <option disabled hidden value="CPU">CPU</option>
                    {CPUS.map((cpu: CPU, index: number) => (
                        <option key={index}>{cpu.name}</option>
                    ))}
                </select>


                <div className="flex flex-col md:w-1/3 w-full">
                    <label htmlFor="hertz" className="font-semibold">CPU-ს ბირთვი</label>                    
                    <input required
                    onChange={e => {
                        setHertz(e.target.value);
                        setError(old => ({...old, hertz: false })) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={hertzRef} id="hertz" type="text" placeholder="14" 
                    className={`${!error.hertz ? 'border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400'
                    : 'border-red-500 focus:outline-none'} w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                    <sub className="text-[0.7rem] mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები</sub>
                </div>

                <div className="flex flex-col md:w-1/3 w-full">
                    <label htmlFor="thread" className="font-semibold">CPU-ს ნაკადი</label>                    
                    <input required
                    onChange={e => {
                        setThread(e.target.value);
                        setError(old => ({...old, thread: false })) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }} ref={threadRef} id="thread" type="text" placeholder="365" 
                    className={`${!error.thread ? 'border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400'
                    : 'border-red-500 focus:outline-none'} w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                    <sub className="text-[0.7rem] mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები </sub>
                </div>
            </div>

            <div className="border-b border-1 border-[#C7C7C7] gap-5 h-[16vh] w-full flex flex-row justify-between items-center">
                <div className="flex flex-col md:w-5/12 w-full">
                    <label htmlFor="ram" className="font-semibold">ლეპტოპის RAM (GB)</label>                    
                    <input required onChange={e => {
                        setRam(e.target.value);
                        setError(old => ({...old, ram: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={ramRef} 
                    id="ram" type="text" placeholder="HP" className={`${!error.ram ? 'border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400'
                    : 'border-red-500 focus:outline-none'} w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები </sub>
                </div>
                
                <div className="w-1/3">
                    <label htmlFor="storageType" className="p-4 font-semibold">მეხსიერების ტიპი</label>
                    <div id="storageType" className="w-full flex flex-row justify-between items-start p-4">
                        <div className="inline-flex justify-between w-16">
                            <input type="radio" name="harddrivetype" id="SSD" className="text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="SSD" ref={harddriveRef} onChange={e=>SetHardDriveType(e.target.value)}/>
                            <label htmlFor="SSD">SSD</label>
                        </div>

                        <div className="inline-flex justify-between w-16">
                            <input type="radio" name="harddrivetype" id="HDD" className="text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="HDD" ref={harddriveRef} onChange={e=>SetHardDriveType(e.target.value)}/>
                            <label htmlFor="HDD">HDD</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="gap-5 h-[16vh] w-full flex flex-row justify-between items-center">
                <div className="flex flex-col md:w-5/12 w-full">
                    <label htmlFor="date" className="font-semibold">შეძენის რიცხვი (არჩევითი)</label>                    
                    <input onChange={e => setDate(e.target.value)} ref={dateRef} id="date" type="text" placeholder="დდ / თთ / წწწწ" 
                    className={`border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400
                    w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                </div>

                <div className="flex flex-col md:w-5/12 w-full">
                    <label htmlFor="price" className="font-semibold">ლეპტოპის ფასი</label>                    
                    <input required
                    onChange={e => {
                        setPrice(e.target.value);
                        setError(old => ({...old, price: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={priceRef} id="price" type="text" placeholder="0000" 
                    className={`${!error.price ? 'border-blue-400 focus:outline focus:outline-2 focus:outline-blue-400'
                    : 'border-red-500 focus:outline-none'} w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები</sub>
                </div>
            </div>

            <div className="gap-5 h-[16vh] w-1/3 flex flex-col justify-center items-start">
                <label htmlFor="condition" className="font-semibold">ლეპტოპის მდგომარეობაში</label>
                <div className="w-full">
                    <div id="condition" className="w-full flex flex-row justify-between items-start">
                        <div className="inline-flex justify-between">
                            <input type="radio" name="condition" id="SSD" className="mr-2 text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="ახალი" onChange={e=>SetCondition(e.target.value)} ref={conditionRef}/>
                            <label htmlFor="SSD"> ახალი</label>
                        </div>

                        <div className="inline-flex justify-between">
                            <input type="radio" name="condition" id="HDD" className="mr-2 text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="მეორადი" onChange={e=>SetCondition(e.target.value)} ref={conditionRef}/>
                            <label htmlFor="HDD"> მეორადი</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-between items-center w-full">
                <input onClick={() => location.assign('/new-user')} type="button" value="უკან" 
                className="text-left rounded-lg bg-white text-[#62A1EB]" />
                <input type="submit" value="დამახსოვრება" className="rounded-lg p-4 pr-6 pl-6 bg-[#62A1EB] text-white" />
            </div>

        </motion.form>
    );
}