import { useEffect, useState } from 'react';
import redberry from '../assets/LOGO.png';

export default function Footer(): JSX.Element {
    const [ShowFooter, setShowFooter] = useState<boolean>(false);
    
    //? Make footer visible to the specific routes only

    useEffect(() => {
        if(window.location.pathname.slice(0, 7) === '/laptop' || window.location.pathname === '/my-laptops') {
            setShowFooter(false);
        } else {
            setShowFooter(true)
        }
    }, [window.location.pathname])
    return (
        <div className={`${ShowFooter ? 'flex' : "hidden" } fixed flex-row justify-around align-center w-full 
        lg:h-10 2xl:h-16 text-white left-0 bottom-0 mb-4`}>
            <img src={redberry} alt="Not Found" className="mb-10 h-full md:block hidden" />
        </div>
    );
}