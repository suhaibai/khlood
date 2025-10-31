
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-cyan-400 border-t-transparent"
      ></div>
      <p className="text-cyan-300 text-lg">جاري التحميل...</p>
    </div>
  );
};

export default Spinner;
