import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Consistent back navigation. Defaults to browser back (navigate(-1)),
 * or pass `to` for a fixed destination (useful when the previous page
 * shouldn't be revisited, e.g. leaving Result shouldn't go back into
 * a submitted form).
 */
const BackButton = ({ to, label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-muted
        hover:text-ink transition-colors mb-5 group ${className}`}
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
};

export default BackButton;
