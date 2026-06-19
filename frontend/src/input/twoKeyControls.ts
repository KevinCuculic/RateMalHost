import { useEffect, useRef } from 'react';

interface MenuItem {
  id: string;
  action: () => void;
}

export function useToolWheelKeyboard(
  visible: boolean,
  activeSub: string | null,
  menuItems: MenuItem[]
) {
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    if (!visible || activeSub !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const max = menuItems.length;

      if (e.key === 'ArrowLeft') {
        selectedIndexRef.current =
          (selectedIndexRef.current - 1 + max) % max;
      }

      if (e.key === 'ArrowRight') {
        selectedIndexRef.current =
          (selectedIndexRef.current + 1) % max;
      }

      if (e.key === 'Enter') {
        menuItems[selectedIndexRef.current]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, activeSub, menuItems]);

  return selectedIndexRef;
}