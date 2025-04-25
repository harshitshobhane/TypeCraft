import React, { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (combo > 0) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(t);
    }
  }, [combo]);

  return (
    <div
      className={`
        absolute top-24 left-1/2 transform -translate-x-1/2
        text-4xl font-bold text-cyan-400 drop-shadow-lg
        transition-opacity duration-300 
        ${visible ? 'opacity-100' : 'opacity-0'}
        z-20
      `}
    >
      🔥 Combo&nbsp;x{combo}
    </div>
  );
};
