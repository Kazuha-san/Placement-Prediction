import React, { useState } from 'react';
import { Info } from 'lucide-react';

const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center ml-2"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <Info className="w-4 h-4 text-muted cursor-pointer hover:text-ink transition-colors" />
      {isVisible && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-max max-w-[220px] bg-ink text-cream text-xs leading-relaxed p-2.5 rounded-xl z-20 shadow-soft">
          {text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-ink" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
