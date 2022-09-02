import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { usePersistentStorageValue, LocalStorage } from '../hooks/localStorage';
import { motion } from "framer-motion";
import { screenState } from "../context";
import { useRecoilState } from "recoil";
import type { Position, Team } from '../types/index';

const localstorage = new LocalStorage();

export default function NewUser(): JSX.Element {
    const [isMobile, setIsMobile] = useRecoilState(screenState);  

    const [Name, setName] = usePersistentStorageValue('name', '');
    const [LastName, setLastName] = usePersistentStorageValue('lastname', '');
    const [Team, setTeam] = usePersistentStorageValue('team', '');
    const [Position, setPosition] = usePersistentStorageValue('position', '');
    const [SelectedPosition, setSelectedPosition] = usePersistentStorageValue('position', '');
    const [Mail, setMail] = usePersistentStorageValue('mail', '');
    const [Phone, setPhone] = usePersistentStorageValue('phone', '');

    const [Result, setResult] = usePersistentStorageValue('user', {});

    const [teams, setTeams] = useState<Team[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [error, setError] = useState({
        name: false,
        lastname: false,
        mail: false,
        phone: false,
    });

    const nameRef = useRef<HTMLInputElement>(null);
    const lastnameRef = useRef<HTMLInputElement>(null);
    const teamRef = useRef<HTMLSelectElement>(null);
    const positionRef = useRef<HTMLSelectElement>(null);
    const mailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        function updateSize() {
            setIsMobile(window.innerWidth < 600);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [])

    useEffect(() => {
        async function GetTeams() {
            const response = await fetch(`${import.meta.env.VITE_URL}/teams`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            setTeams(data.data);
        }
        async function GetPositions() {
            const response = await fetch(`${import.meta.env.VITE_URL}/positions`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            setPositions(data.data);
        }
        GetTeams();
        GetPositions();
    }, []);
    
    useEffect(() => {
        if (nameRef     .current) nameRef.current.value = Name;
        if (lastnameRef .current) lastnameRef.current.value = LastName;
        if (teamRef     .current) teamRef.current.selectedIndex = +Team;
        if (positionRef .current) positionRef.current.selectedIndex= +SelectedPosition;
        if (mailRef     .current) mailRef.current.value = Mail;
        if (phoneRef    .current) phoneRef.current.value = Phone;
    }, [teamRef.current?.selectedIndex, positionRef.current?.selectedIndex])

    const handlePositions = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setPosition(String(positions.filter((p:Position) => p.name == e.target.value)[0].id));
        setSelectedPosition(String(e.target.selectedIndex));
    }

    const handleChange = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //! Make sure refs are not undefined
        if(!nameRef.current || !lastnameRef.current || !mailRef.current || !phoneRef.current) { return; }
        
            //* Handle Name
        if (nameRef.current.value.length && nameRef.current.value.split(``).some(symb => symb < 'ა') 
            || nameRef.current.value.split(``).some(symb => symb > 'ჰ')) 
            setError(old => ({...old, name: true }));
        
            //* Handle LastName
        if (lastnameRef.current.value.length && lastnameRef.current.value.split(``).some(symb => symb < 'ა') 
            || lastnameRef.current.value.split(``).some(symb => symb > 'ჰ')) 
            setError(old => ({...old, lastname: true }));
        
            //* Handle Mail
        if(mailRef.current.value.length && `@${mailRef.current.value.split('@')[1]}` !== '@redberry.ge')
            setError(old => ({...old, mail: true }));

        const phoneVal = phoneRef.current.value.trim().split(' ').join('');

        if(phoneVal.substring(0, 5) !== '+9955' || phoneVal.length !== 13) 
            setError(old => ({...old, phone: true }));
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResult({
            name: nameRef?.current?.value,
            surname: lastnameRef?.current?.value,
            team_id: teamRef?.current?.selectedIndex,
            position_id: Position,
            email: mailRef?.current?.value,
            phone_number: phoneRef?.current?.value
        });

        if(!Object.entries(error).filter(arr => arr[1] === true).length) {
            window.location.assign('/new-laptop');
            console.log(Result)
        }
    }

    return (
        <motion.form initial={{ x: 1000 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}  
        onChange={handleChange} onSubmit={handleSubmit} encType="multipart/form-data"
        className="md:h-[80vh] min-h-[80vh] flex flex-col w-full md:w-1/2 2xl:w-1/2 justify-evenly items-end 
        p-4 2xl:pt-20 2xl:pb-20 2xl:p-12 2xl:pr-40 2xl:pl-40 md:m-0 md:m-8 m-0 bg-white">
            <div className="w-full flex md:flex-row flex-col md:mt-0 mt-4 m-0 md:m-8">
                
                {/* სახელი */}
                
                <div className="flex flex-col md:w-[46%] w-full">
                    <label htmlFor="name" className="font-semibold">სახელი</label>                    
                    <input required minLength={3}
                    onChange={e => {
                        setName(e.target.value);
                        setError(old => ({...old, name: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={nameRef} id="name" type="text" placeholder="გრიშა" 
                    className={`rounded-md w-full mt-2 mb-2 p-2 border border-5
                    ${!error.name ? 'input-success' : 'input-error' } input `} />
                    {!error.name 
                    ? (<sub className="mt-2 mb-2 w-full text-gray-600">მინიმუმ 2 სიმბოლო, ქართული ასოები</sub>)
                    : (<sub className="mt-2 mb-2 w-full text-red-600">გამოიყენე ქართული ასოები</sub>)}
                </div>
                <div className="w-[8%] md:block hidden"></div>
                
                {/* გვარი */}

                <div className="flex flex-col md:w-[46%] w-full">
                    <label htmlFor="lastname" className="font-semibold">გვარი</label>
                    <input required minLength={3}
                    onChange={e => {
                        setLastName(e.target.value);
                        setError(old => ({...old, lastname: false})) // მოვაშოროთ ერორი ახლიდან ჩაწერის პროცესში
                    }}
                    ref={lastnameRef} id="lastname" type="text" placeholder="ბაგრატიონი"
                    className={`rounded-md w-full mt-2 mb-2 p-2 border border-5  
                    ${!error.lastname ? 'input-success' : 'input-error' } input `} />
                    {!error.lastname 
                    ? (<sub className="mt-2 mb-2 w-full text-gray-600">მინიმუმ 2 სიმბოლო, ქართული ასოები</sub>)
                    : (<sub className="mt-2 mb-2 w-full text-red-600">გამოიყენე ქართული ასოები</sub>)}
                </div>
            </div>

                {/* თიმი */}
            
            <select required ref={teamRef} onChange={e => setTeam(String(e.target.selectedIndex))} 
            className="w-full bg-[#EBEBEB] font-semibold rounded-lg p-[1rem] text-sm mt-4 mb-4 ra-select m-0 md:m-8">
                <option disabled hidden value="თიმი">თიმი</option>
                {teams.map((team: Team, index: number) => (
                    <option key={index}>{team.name}</option>
                ))}
            </select>
            
                {/* პოზიცია */}
                
            <select disabled={teamRef.current?.value == 'თიმი'} required ref={positionRef} defaultValue="პოზიცია"
            onChange={e => handlePositions(e)}
            className="w-full bg-[#EBEBEB] font-semibold rounded-lg p-[1rem] text-sm mt-4 mb-4 ra-select m-0 md:m-8">
                <option disabled hidden value="პოზიცია">პოზიცია</option>
                {positions.filter((position:Position) => +Team == position.team_id).map((position: Team, index: number) => (
                    <option key={index} value={position.name}>{position.name}</option>
                ))}
            </select>

                {/* მეილი */}

            <div className="flex flex-col w-full mt-4 mb-4 m-0 md:m-8">
                <label htmlFor="mail" className="font-semibold">მეილი</label>
                <input required onChange={e => { setMail(e.target.value); setError(old => ({ ...old, mail: false })) }}
                ref={mailRef} id="mail" type="email" placeholder="grish666@redberry.ge"
                className={`${!error.mail ? 'input-success' : 'input-error' } input rounded-md w-full p-2 border border-5`} />
                <sub className={`${error.mail ? 'text-red-600' : 'text-gray-600'} mt-2`}>უნდა მთავრდებოდეს @redberry.ge-ით</sub>
            </div>

                {/* ტელოფნის ნომერი */}

            <div className="flex flex-col w-full mt-4 mb-4 m-0 md:m-8">
                <label htmlFor="phone" className="font-semibold">ტელეფონის ნომერი</label>
                <input required
                onChange={e => { setPhone(e.target.value); setError(old => ({ ...old, phone: false })) }} 
                ref={phoneRef} id="phone" type="text" placeholder="+995 598 00 07 01"
                className={`${!error.phone ? 'input-success' : 'input-error' } input rounded-md w-full p-2 border border-5`} />
                <sub className={`${error.phone ? 'text-red-600' : 'text-gray-600'} mt-2`}>
                    {isMobile ? 'ქართული მობ-ნომრის ფორმატს' : 'უნდა აკმაყოფილებდეს ქართული მობ-ნომრის ფორმატს'} 
                </sub>
            </div>
            <input type="submit" value="შემდეგი" className="right-0 rounded-lg mt-10 md:w-40 w-28 p-2 h-12 bg-[#62A1EB] 
            hover:bg-blue-400 text-white" />
        </motion.form>
    );
}