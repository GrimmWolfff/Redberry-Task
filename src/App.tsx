import { useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Loader from './components/Loader';

// Recoil
import { modalState, screenState } from "./context";
import { useRecoilState } from "recoil";

export default function App() {
  const Landing = lazy(() => import('./pages/Landing'));
  const Top = lazy(() => import('./components/Top'));
  const NewUser = lazy(() => import('./pages/new-user'));
  const NewLaptop = lazy(() => import('./pages/new-laptop'));
  const Laptops = lazy(() => import('./pages/Laptops'));
  const LaptopDetails = lazy(() => import('./pages/LaptopDetails'));
  const Footer = lazy(() => import('./components/Footer'));
  
  const [isMobile, setIsMobile] = useRecoilState(screenState);  
  const [ShowModal, SetShowModal] = useRecoilState(modalState);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
  }, []);

  useLayoutEffect(() => {
      function updateSize() {
        setIsMobile(window.innerWidth < 600);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <div className="w-full min-h-screen absolute bg-gray-100">
            <Top />
            <div className={`${ShowModal ? 'bg-[#4A4A4A] h-screen' : 'bg-transparent min-h-[80vh]' } 
            relative w-full flex flex-col justify-around items-center`}>
              <Routes>
                <Route element={<Landing />  } path="/" />
                <Route element={<NewUser />} path="/new-user" />
                <Route element={<NewLaptop />   } path="/new-laptop" />
                <Route element={<Laptops />   } path="/my-laptops" />
                <Route element={<LaptopDetails />   } path="/laptop/:id" />
              </Routes>
            </div>
          </div>
          <Footer />
        </BrowserRouter>
      </Suspense>
  )
}