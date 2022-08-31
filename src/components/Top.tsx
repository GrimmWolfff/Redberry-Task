import { useState, useLayoutEffect, useEffect } from 'react';
import { usePersistentStorageValue, LocalStorage } from '../hooks/localStorage';
import backArrow from '../assets/less-than-symbol.png';
import lessthan from '../assets/less-than-symbol.png';

const localstorage = new LocalStorage();
export default function Top(): any {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [IsPage1, setIsPage1] = useState<boolean>(true);
    const [active, setActive] = usePersistentStorageValue<string>("");
    const [Show, setShow] = useState<boolean>();
    const [ShowTabs, setShowTabs] = useState<boolean>();

    useLayoutEffect(() => {
        function updateSize() {
            setIsMobile(window.innerWidth < 600);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        if(window.location.pathname === '/new-user') {
            setActive("თანამშრომლების ინფო");
            setIsPage1(true);
            setShow(true);
            setShowTabs(true);
        } else if (window.location.pathname === '/new-laptop') {
            setActive("ლეპტოპის მახასიათებლები");
            setIsPage1(false);
            setShow(true);
            setShowTabs(true);
        } else if (window.location.pathname === '/my-laptops') {
            setActive("");
            setIsPage1(false);
            setShow(true);
            setShowTabs(false);
        } else {
            setActive("");
            setIsPage1(false);
            setShow(false);
            setShowTabs(false);
        }
    } , [active]);
    return (
        !isMobile ? (
            <div className={`${!Show ? 'hidden' : 'flex'} cursor-pointer flex-row justify-center gap-20 w-full h-[5%] mt-[5vh]`}>
                <img className={`${isMobile || window.location.pathname === '/' ? 'hidden' : 'flex'}
                bottom-[90%] absolute z-50 left-0 m-8 w-10 h-10 bg-gray-300 rounded-full 
                justify-center items-center font-bold hover:scale-[0.95] mb-18`}
                src={lessthan} alt="Not found" onClick={() => location.assign('/')} />

                <h5 className={`${IsPage1 ? 'active' : ''} ${ShowTabs ? 'flex' : 'hidden'} font-bold text-lg`}
                onClick={() => window.location.assign('/new-user')}>თანამშრომლების ინფო</h5>
                <h5 className={`${!IsPage1 ? 'active' : ''} ${ShowTabs ? 'flex' : 'hidden'} font-bold text-lg`}
                onClick={() => {
                    if(Object.entries(localstorage.getItem('result')).filter(el => el[1] === "").length) {
                        window.location.assign('/new-laptop');
                    }
                }}>ლეპტოპის მახასიათებლები</h5>
            </div>
        ) : (
            <div className="w-full bg-gray-[#F6F6F6] flex flex-row justify-center items-center top-0 h-20">
                <img src={backArrow} alt="..." className={`${active ? 'flex' : 'hidden'} mr-2 w-10 h-10 rounded-full mb-2`}
                onClick={() => location.assign('/')} />
                <h5 className={`${active ? 'flex' : 'hidden'} flex-col justify-around items-center w-full text-center font-bold
                text-[16px] left-[-25px]`}>
                    <p> {active} </p>
                    <p className="text-gray-500 font-thin">{IsPage1 ? '1/2' : '2/2'} </p>
                </h5>
            </div>
        )
    );
}