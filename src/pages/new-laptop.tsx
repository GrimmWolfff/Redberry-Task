import { FormEvent, useEffect, useState, useRef, ChangeEvent } from "react";
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import type { CPU, Laptop, User } from "../types";
import axios from "axios";
import { Buffer } from 'buffer';

//* Assets
import Camera from '../assets/camera.png';
import Done from '../assets/done.jpg';
import Warning from '../assets/warning.png';

//? Recoil
import { modalState } from "../context";
import { useRecoilState } from "recoil";

//* LocalStorage
import { usePersistentStorageValue, LocalStorage } from "../hooks/localStorage";
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
        price: false,
        image: false,
        condition: false,
        HardDriveType: false
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

    const [Image, SetImage] = useState<File>();
    const [ShowModal, SetShowModal] = useRecoilState(modalState);

    const brandRef = useRef<HTMLSelectElement>(null);
    const lnameRef = useRef<HTMLInputElement>(null);
    const cpuRef = useRef<HTMLSelectElement>(null);
    const hertzRef = useRef<HTMLInputElement>(null);
    const threadRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const ramRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function GetBrands() {
            const response = await fetch(`${import.meta.env.VITE_URL}/brands`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            if (brandRef.current) brandRef.current.selectedIndex = +Brand;
            setBrands(data.data);
        }
        async function GetCPUS() {
            const response = await fetch(`${import.meta.env.VITE_URL}/cpus`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            if (cpuRef.current) cpuRef.current.selectedIndex = data.data.filter((el:CPU) => el.name == Cpu)[0]?.id;
            setCPUS(data.data);
        }
        GetBrands();
        GetCPUS();
    }, []);

    useEffect(() => {
        if (lnameRef.current) lnameRef.current.value = Lname;
        if (hertzRef.current) hertzRef.current.value = Hertz;
        if (threadRef.current) threadRef.current.value = Thread;
        if (dateRef.current) dateRef.current.value = Date;
        if (ramRef.current) ramRef.current.value = Ram;
        if (priceRef.current) priceRef.current.value = Price;
        if (hertzRef.current) hertzRef.current.value = Hertz;
    }, [])

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target || !e.target.files || !e.target.files[0]) {
            return;
        }
        if(e.target.files[0].type.slice(0, 5) !== 'image') {
            setError(old => ({...old, image: true }));
            return;
        }
        SetImage(e.target.files[0]);
    }

    const handleChange = (e: FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        if(!brandRef.current||!lnameRef.current||!cpuRef.current||!threadRef.current
        ||!dateRef.current||!hertzRef.current||!ramRef.current||!priceRef.current) { return; }
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

        if(!HardDriveType || !Condition) {
            setError(old => ({ ...old, HardDriveType: !Boolean(HardDriveType) }));
            setError(old => ({ ...old, condition: !Boolean(Condition) }));
            return;
        }

        if(!Image) {
            return;
        }


        const { name, surname, team_id, position_id, email, phone_number }:User = await localstorage.getItem('user');

        const formdata = new FormData();
        console.log(team_id);
        formdata.append('name', name) 
        formdata.append('surname', surname)
        formdata.append('team_id', String(team_id))
        formdata.append('position_id', String(position_id))
        formdata.append('email', email)
        formdata.append('phone_number', phone_number)
        formdata.append('laptop_name', Lname)
        formdata.append('laptop_brand_id', Brand) 
        formdata.append('laptop_cpu', Cpu) 
        formdata.append('laptop_cpu_cores', Hertz)
        formdata.append('laptop_cpu_threads', Thread)
        formdata.append('laptop_purchase_date', Date)
        formdata.append('laptop_price', Price)
        formdata.append('laptop_ram', Ram)
        formdata.append('laptop_image', Image)
        formdata.append('laptop_hard_drive_type', HardDriveType)
        formdata.append('laptop_state', Condition === 'ახალი' ? 'new' : 'used')
        formdata.append('token', import.meta.env.VITE_TOKEN)

        const headers = { 'Content-Type': 'multipart/form-data' };

        const createLaptop = async (data: FormData) => {
            await axios.post(`${import.meta.env.VITE_URL}/laptop/create`, 
                data,
                {headers}
            ).then(res => {
                console.log(res)
            }).catch(error => {
                console.error(error);
            })
        }
        try {
            if(!Object.entries(error).filter(arr => arr[1] === true).length) {
                // for (const p of formdata)
                //     console.log(p);

                createLaptop(formdata);
                // SetShowModal(true);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return ShowModal ? (<Modal />) : (
        <motion.form method="POST" className={`${ShowModal ? 'bg-[#4A4A4A]' : 'bg-white'} gap-5 md:gap-0 min-h-full w-full md:w-3/4 lg:w-2/3 
        xl:w-1/2 mt-4 2xl:pt-16 2xl:pr-36 2xl:pl-36 2xl:pb-10 2xl:mb-24 flex flex-col justify-around items-start`} onChange={handleChange} onSubmit={handleSubmit}
            initial={{ x: -1000 }} animate={{ x: 0 }} transition={{ duration: 0.5 }} encType='multipart/form-data'>

                {window.screen.width > 600 ? (
                    Image ?
                        <div className="w-full flex flex-col items-center justify-center rounded-x">
                            <img src={URL.createObjectURL(Image)} alt="..." className="w-full h-full"/>
                            <div className="w-full h-16 flex flex-row justify-between p-2 items-center">
                                <p className="w-1/3 flex flex-row items-center">
                                    <img src={Done} alt="..." className="w-[20px] h-[20px]" />
                                    &nbsp;{Image.name.length > 16 ? 
                                    `...${Image.name.slice(Image.name.length - 12, Image.name.length)}`
                                    : Image.name
                                    }
                                    &nbsp;
                                    <sub>{(Image.size / 1024 / 1024).toFixed(1)} mb</sub></p>
                                
                                <div className="w-1/3 h-full">
                                    <label htmlFor="files" className="btn-fill w-full text-lg font-light h-full flex 
                                    flex-row justify-around items-center">თავიდან&nbsp;ატვირთე</label>
                                    <input onChange={e => handleSelectFile(e)} id="files" className="invisible" type="file" />    
                                </div>
                            </div>
                        </div>
                    : (
                        <div className={`${error.image ? 'bg-[#FFF1F1] border-[#E52F2F]' : 'bg-[#F7F7F7] border-[#4386A9]'}
                        flex flex-col items-center justify-center border-dashed border-[2px] h-[30vh] w-full rounded-[18px]`}>
                            <img src={Warning} alt="!" className={`${error.image ? '' : 'hidden'} w-[30px] h-[28px] mb-4`} />
                            <p className={`${error.image ? 'text-[#E52F2F]' : 'text-[#4386A9]'} text-center`}>ჩააგდე ან ატვირთე <br /> ლეპტოპის ფოტო</p>
                            <><br /><br /></>
                            <label className="w-40 text-center right-0 rounded-lg p-[0.7rem] bg-[#62A1EB] text-white"
                            htmlFor="files">ატვირთე</label>
                            <input onChange={e => handleSelectFile(e)} id="files" className="invisible" type="file" />    
                        </div>
                    )
                )
                // Iphone 12 Pro 
                : (
                    Image ? (
                        <div className="overflow-hidden w-full max-h-1/2 flex flex-col items-center justify-center rounded-x">
                            <img src={URL.createObjectURL(Image)} alt="..." className="w-full h-full"/>
                            <div className="w-full h-16 flex flex-row justify-between p-2 items-center">
                                <p className="w-1/3 flex justify-evenly items-center">
                                    <img src={Done} alt="..." className="w-[20px] h-[20px]" />
                                    <span className="flex flex-col justify-start">
                                        &nbsp;
                                        {Image.name.length > 12 ? 
                                        `...${Image.name.slice(Image.name.length - 8, Image.name.length)}`
                                        : Image.name
                                        }
                                        &nbsp;
                                        <sub className="flex flex-row text-sm">{(Image.size / 1024 / 1024).toFixed(1)}&nbsp;mb</sub>
                                    </span>
                                </p>                                
                                <div className="w-1/2 h-full">
                                    <label htmlFor="files" className="btn-fill w-full text-lg font-light h-full flex 
                                    flex-row justify-around items-center">თავიდან&nbsp;ატვირთე</label>
                                    <input onChange={e => handleSelectFile(e)} id="files" className="invisible" type="file" />    
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`${error.image ? 'bg-[#FFF1F1] border-[#E52F2F]' : 'bg-[#F7F7F7] border-[#4386A9]'}
                        flex flex-col items-center justify-center h-60 md:h-[30vh] w-[95%] md:w-full
                        border-dashed border-2 rounded-xl ml-2`}>
                            <img src={Camera} alt="ატვირთე" />
                            <label htmlFor="ff" className={`${error.image ? 'text-[#E52F2F]' : 'text-[#4386A9]'} text-center
                            mt-4`}>ლეპტოპის ფოტოს <br/> ატვირთვა</label>
                            <input ref={imgRef} onChange={e => handleSelectFile(e)} id="files" 
                            className="w-full h-1/6 opacity-0 absolute" type="file" />
                            <img src={Warning} alt="!" className={`${error.image ? '' : 'hidden'} w-[24px] h-[20px] mt-4`}/>    
                        </div>    
                    )
                    )
                }
            
            <div className="h-auto md:h-[16vh] border-b border-1 border-[#C7C7C7] w-full 
            flex md:flex-row flex-col justify-between items-center">
                <div className="flex flex-col md:w-5/12 w-full p-2">
                    <label htmlFor="lname" className="font-semibold">ლეპტოპის სახელი </label>                    
                    <input required
                    onChange={e => {
                        setLname(e.target.value);
                        setError(old => ({...old, lname: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={lnameRef} 
                    id="lname" type="text" placeholder="HP" 
                    className={`${!error.lname ? 'input-success' : 'input-error'} input`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">ლათინური ასოები, ციფრები, !@#$%^&*()_+= </sub>
                </div>

                <select required ref={brandRef} defaultValue="ლეპტოპის ბრენდი" onChange={e => setBrand(String(e.target.selectedIndex))} 
                    className="md:w-5/12 w-[95%] bg-[#EBEBEB] font-semibold rounded-lg p-[1rem] text-sm mt-4 mb-4 ra-select
                    focus:outline-none">
                        <option disabled hidden value="ლეპტოპის ბრენდი">ლეპტოპის ბრენდი</option>
                        {Brands.map((brand: Laptop, index: number) => (
                            <option key={index}>{brand.name}</option>
                        ))}
                </select>
            </div>

            <div className="gap-5 h-auto md:h-[16vh] w-full flex flex-col md:flex-row justify-between items-center">
            
                <select required ref={cpuRef} id="ss" defaultValue="CPU" onChange={e => setCpu(e.target.value)} 
                className="md:w-1/3 w-[95%] bg-[#EBEBEB] font-semibold rounded-lg p-[1rem] text-sm ra-select focus:outline-none mt-2">
                    <option disabled hidden value="CPU">CPU</option>
                    {CPUS.map((cpu: CPU, index: number) => (
                        <option key={index}>{cpu.name}</option>
                    ))}
                </select>


                <div className="flex flex-col md:w-1/3 w-[95%]">
                    <label htmlFor="hertz" className="font-semibold">CPU-ს ბირთვი</label>                    
                    <input required
                    onChange={e => {
                        setHertz(e.target.value);
                        setError(old => ({...old, hertz: false })) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={hertzRef} id="hertz" type="text" placeholder="14" 
                    className={`${!error.hertz ? 'input-success' : 'input-error' } input`} />
                    <sub className="text-[0.7rem] mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები</sub>
                </div>

                <div className="flex flex-col md:w-1/3 w-[95%]">
                    <label htmlFor="thread" className="font-semibold">CPU-ს ნაკადი</label>                    
                    <input required
                    onChange={e => {
                        setThread(e.target.value);
                        setError(old => ({...old, thread: false })) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }} ref={threadRef} id="thread" type="text" placeholder="365" 
                    className={`${!error.thread ? 'input-success' : 'input-error' } input`} />
                    <sub className="text-[0.7rem] mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები </sub>
                </div>
            </div>

            <div className="border-b border-1 border-[#C7C7C7] gap-5 h-auto md:h-[16vh] w-[95%] 
            flex flex-col md:flex-row justify-between items-center m-2">
                <div className="flex flex-col md:w-5/12 w-full">
                    <label htmlFor="ram" className="font-semibold">ლეპტოპის RAM (GB)</label>                    
                    <input required onChange={e => {
                        setRam(e.target.value);
                        setError(old => ({...old, ram: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={ramRef} 
                    id="ram" type="text" placeholder="16" className={`${!error.ram ? 'input-success' : 'input-error'} input`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები </sub>
                </div>
                
                <div className="md:w-1/3 w-full">
                    <label htmlFor="hardDriveType" className={`${error.HardDriveType ? 'text-[#E52F2F]' : 'text-black'} 
                    pb-2 md:p-4 font-semibold inline-flex`}>
                        მეხსიერების ტიპი&nbsp;&nbsp;&nbsp;
                        <img src={Warning} alt="!" className={`${error.HardDriveType ? '' : 'hidden'} w-[22px] h-[20px] mb-4`} />
                    </label>
                    <div id="hardDriveType" className="w-full flex flex-row justify-evenly md:justify-between items-start p-2">
                        <div className="inline-flex justify-between w-16 mr-28">
                            <input type="radio" name="harddrivetype" id="SSD" className="text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="SSD" defaultChecked={HardDriveType === 'SSD'} 
                            onChange={e => {
                                SetHardDriveType(e.target.value);
                                setError(old => ({ ...old, HardDriveType: false }))
                            }}/>
                            &nbsp;&nbsp;
                            <label htmlFor="SSD">SSD</label>
                        </div>

                        <div className="inline-flex justify-between w-16 mr-28">
                            <input type="radio" name="harddrivetype" id="HDD" className="text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="HDD" defaultChecked={HardDriveType === 'HDD'} 
                            onChange={e => {
                                SetHardDriveType(e.target.value);
                                setError(old => ({ ...old, HardDriveType: false }))
                            }}/>
                            &nbsp;&nbsp;
                            <label htmlFor="HDD">HDD</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="gap-5 h-auto md:h-[16vh] w-full flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:w-5/12 w-[95%]">
                    <label htmlFor="date" className="font-semibold">შეძენის რიცხვი (არჩევითი)</label>                    
                    <input onChange={e => setDate(e.target.value)} ref={dateRef} id="date" type="text" placeholder="დდ / თთ / წწწწ" 
                    className={`input-success input w-full rounded-md mt-2 mb-2 p-2 border border-5`} />
                </div>

                <div className="flex flex-col md:w-5/12 w-[95%]">
                    <label htmlFor="price" className="font-semibold">ლეპტოპის ფასი</label>                    
                    <input required
                    onChange={e => {
                        setPrice(e.target.value);
                        setError(old => ({...old, price: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={priceRef} id="price" type="text" placeholder="0000" 
                    className={`${!error.price ? 'input-success' : 'input-error' } input`} />
                    <sub className="mt-2 mb-2 w-full text-gray-600">მხოლოდ ციფრები</sub>
                </div>
            </div>

            <div className="gap-5 h-auto h-auto p-4 md:p-0 md:h-[16vh] w-full md:w-1/3 flex flex-col justify-center items-start">
                    <label htmlFor="condition" className={`${error.condition ? 'text-[#E52F2F]' : 'text-black'} 
                        pt-2 font-semibold inline-flex`}>ლეპტოპის მდგომარეობა&nbsp;&nbsp;&nbsp;
                        <img src={Warning} alt="!" className={`${error.condition ? '' : 'hidden'} w-[22px] h-[20px] mb-4`} />
                    </label>
                <div className="w-full">
                    <div id="condition" className="w-full flex flex-row justify-evenly md:justify-between items-start p-0">
                        <div className="inline-flex justify-between mr-[5.5rem]">
                            <input type="radio" name="condition" id="SSD" className="mr-2 text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="ახალი" onChange={e=>SetCondition(e.target.value)}
                            defaultChecked={Condition === 'ახალი'} />
                            <label htmlFor="SSD"> ახალი</label>
                        </div>

                        <div className="inline-flex justify-between mr-[5.5rem]">
                            <input type="radio" name="condition" id="HDD" className="mr-2 text-sky-500 border border-[#4D9AC3]
                            border-1 rounded-lg text-blue-400" value="მეორადი" onChange={e=>SetCondition(e.target.value)}
                            defaultChecked={Condition === 'მეორადი'} />
                            <label htmlFor="HDD"> მეორადი</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-between items-center w-full md:mb-0 mb-20 p-4">
                <input onClick={() => location.assign('/new-user')} type="button" value="უკან" 
                className="btn-empty p-2" />
                <input type="submit" value="დამახსოვრება" className="btn-fill font-light 
                flex flex-col justify-around items-center h-10 md:h-12" />
            </div>

        </motion.form>
    );
}