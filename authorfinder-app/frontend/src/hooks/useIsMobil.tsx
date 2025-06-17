// useIsMobile.js
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 992; // define your breakpoint for mobile devices

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    handleResize();

    //add event listener
    window.addEventListener('resize', handleResize);

    // dispose the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;