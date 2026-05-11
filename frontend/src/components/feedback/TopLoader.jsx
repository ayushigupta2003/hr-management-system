import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Slim top-of-page progress bar that activates whenever any
 * Redux slice has isLoading or isSaving = true.
 */
export function TopLoader() {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const timerRef = useRef(null);

  const isActive = useSelector((state) =>
    Object.values(state).some(
      (slice) => slice?.isLoading === true || slice?.isSaving === true
    )
  );

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      setProgress(0);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 85) { clearInterval(timerRef.current); return 85; }
          return p + Math.random() * 12;
        });
      }, 200);
    } else {
      clearInterval(timerRef.current);
      setProgress(100);
      const hide = setTimeout(() => { setVisible(false); setProgress(0); }, 400);
      return () => clearTimeout(hide);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-0.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_0_8px_rgba(36,107,254,0.6)] transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Loading"
    />
  );
}
