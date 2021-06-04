import {useState, useEffect} from 'react'

const useResizable = (ref) => {
  const [dimmensions, setDimmensions] = useState(null);
  useEffect(() => {
    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimmensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observerTarget);
    return () => {
      resizeObserver.unobserve(observerTarget);
    };
  }, [ref]);

  return dimmensions;
};

export default useResizable