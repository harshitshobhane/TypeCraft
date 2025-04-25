import React, { useState } from 'react';

export const PowerUpInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="
          absolute top-8 right-5 z-20
          bg-yellow-400 text-black
          px-4 py-2 rounded-lg shadow-lg
          hover:bg-yellow-500 transition
        "
      >
        💡 Power-Up Info
      </button>

      {open && (
        <div
          className="
            absolute top-16 right-5 z-20
            bg-gray-900 text-yellow-400
            p-4 rounded-lg border border-yellow-400
            shadow-lg w-64 text-sm
          "
        >
          <p>⚡ <strong>Power-Up Info:</strong></p>
          <ul className="list-disc list-inside">
            <li>💛 <strong>Yellow Word</strong>: Heals 20 HP instantly.</li>
            <li>Appear Chance: ~20%</li>
            <li>Earn more by hitting high combos!</li>
          </ul>
          <p className="mt-2 italic text-xs">
            🔥 Tip: Combo ×5 or higher increases healing word chance!
          </p>
        </div>
      )}
    </>
  );
};
