import SVG from './svg';
import { motion } from 'framer-motion';

//? Success Modal

export default function Modal() {
    return (
        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
        className='absolute w-full md:w-1/3 h-full md:h-[40%] rounded-none md:rounded-lg
        flex flex-col justify-start md:justify-evenly items-center bg-white mb-40 md:mb-0'>
            <SVG />
            <h1 className="text-xl text-black font-semibold mb-10 text-center">ჩანაწერი
            {window.screen.width > 600 ? '' : <br/> } დამატებულია!</h1>
            <a href="/my-laptops" className='btn-fill text-lg flex flex-col justify-around 
            items-center font-medium w-2/3 md:w-[40%] h-14 mt-[20vh] md:mt-0'>სიაში გადაყვანა</a>
            <a href="/" className='btn-empty font-bold m-4'>მთავარი</a>
        </motion.div>
    );
}
