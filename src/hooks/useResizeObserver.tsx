import { useEffect, useState, RefObject, useMemo, useLayoutEffect } from 'react';

export default function useResizeObserver(ref: RefObject<HTMLElement>) {
  const [rect, setRect] = useState<{ height: number, width: number }>({ width: window.innerWidth, height: window.innerHeight });

  useLayoutEffect(() => {
    if (!ref.current) return;
    
    setRect({ width: ref.current.clientWidth, height: ref.current.clientHeight })
  }, [ref])

  const observer = useMemo(() => new ResizeObserver(([entry]) => {
    setRect(entry.contentRect);
  }), [])

  useEffect(() => {
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return rect;
}
