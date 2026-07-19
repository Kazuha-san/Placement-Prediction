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
      <Info className="w-4 h-4 text-color-text-muted cursor-pointer hover:text-color-primary transition-colors" />
      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] bg-color-surface-light text-color-text-main text-xs p-2 rounded shadow-lg z-10 glass-panel">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-color-surface-light"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
