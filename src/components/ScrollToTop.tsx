// frontend/src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🔥 Jab bhi pathname change ho (naya routing ho), page ko top (0,0) par le jao smoothly.
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // ya 'smooth' agar aap chahte hain ki animated scroll ho
    });
  }, [pathname]); // pathname change hone par yeh trigger hoga

  return null; // Kuch render nahi karega, bas background mein scroll top karega.
};

export default ScrollToTop;