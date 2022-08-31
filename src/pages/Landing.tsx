import guyImg from '../assets/Landing.png';
import logo from '../assets/LOGOTXT.png';
import mobileLanding from '../assets/LandingMobile.png';
import { motion } from "framer-motion";

import { useLayoutEffect, useState } from 'react';

export default function Landing():JSX.Element {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    useLayoutEffect(() => {
        function updateSize() {
            setIsMobile(window.innerWidth < 400);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [])
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-around items-center md:w-1/2 w-3/4 md:h-5/6 h-2/3">
            <img src={logo} alt="Not Found" className='w-20' />
            <img className="w-full sm:w-2/3 h-1/2" src={isMobile ? mobileLanding : guyImg} alt="Not Found" />
            <br /><br />
            <div className='flex flex-col justify-between items-center w-full gap-4'>
                <a href="/new-user" className="bg-[#62A1EB] hover:bg-blue-300 w-full sm:w-2/5 rounded-lg h-12
                    break-normal text-white font-bold flex flex-col justify-around items-center">ჩანაწერის დამატება
                </a>
                <a href="/my-laptops" className="bg-[#62A1EB] hover:bg-blue-300 w-full sm:w-2/5 rounded-lg h-12
                    break-normal text-white font-bold flex flex-col justify-around items-center">ჩანაწერის სია
                </a>
            </div>
        </motion.div>
    );
}