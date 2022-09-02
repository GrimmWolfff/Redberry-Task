import { useLayoutEffect, lazy } from 'react';

//* Vite images
import guyImg from '../assets/Landing.png';
import logo from '../assets/LOGOTXT.png';
import mobileLanding from '../assets/LandingMobile.png';

import { screenState } from "../context";
import { useRecoilState } from "recoil";

import { motion } from "framer-motion";


export default function Landing():JSX.Element {
    const [isMobile, setIsMobile] = useRecoilState(screenState);  
    const SVGL = lazy(() => import('../components/svg_landing'));
    useLayoutEffect(() => {
        function updateSize() {
            setIsMobile(window.innerWidth < 600);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [])
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-around items-center md:w-1/2 w-3/4 md:h-5/6 h-2/3">
            <img src={logo} alt="Not Found" className='w-20' />
            {window.screen.width > 600 ? <SVGL /> : <img className="w-full sm:w-2/3 h-1/2" src={mobileLanding} alt="!"/>}
            <br /><br />
            <div className='flex flex-col justify-between items-center w-full gap-4'>
                <a href="/new-user" className="btn-fill sm:w-2/5 w-full">ჩანაწერის დამატება
                </a>
                <a href="/my-laptops" className="btn-fill sm:w-2/5 w-full">ჩანაწერის სია
                </a>
            </div>
        </motion.div>
    );
}