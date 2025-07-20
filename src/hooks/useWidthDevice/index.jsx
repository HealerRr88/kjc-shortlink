import { useState, useLayoutEffect, useRef } from "react";

export default function useWidthDevice() {
  const [widthDevice, setWidthDevice] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });
  const timeoutIdRef = useRef(null);
  const widthRef = useRef(widthDevice);

  useLayoutEffect(() => {
    const handleResize = () => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        if (typeof window !== "undefined") {
          const newWidth = window.innerWidth;
          if (widthRef.current !== newWidth) {
            widthRef.current = newWidth;
            setWidthDevice(newWidth);
          }
        }
      }, 150);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return widthDevice;
}