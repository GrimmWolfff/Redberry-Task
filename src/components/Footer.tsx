import redberry from '../assets/LOGO.png';

export default function Footer(): JSX.Element {
    return (
        <div className="fixed flex flex-row justify-around align-center w-full lg:h-10 2xl:h-16 text-white left-0 bottom-0 mb-4">
            <img src={redberry} alt="Not Found" className="mb-10 h-full md:block hidden" />
        </div>
    );
}