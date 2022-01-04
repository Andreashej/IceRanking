import { useEffect, useState, RefObject, useMemo } from 'react';

export default function useIntersectionObserver(ref: RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isOnScreen, setIsOnScreen] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting),
      options
    ), [options])

  useEffect(() => {
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isOnScreen;
}
