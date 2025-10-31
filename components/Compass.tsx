import React from 'react';
import { CAREER_PATHS } from '../types';

interface CompassProps {
  status: 'idle' | 'analyzing' | 'result';
  targetAngle?: number;
}

const Compass: React.FC<CompassProps> = ({ status, targetAngle = 0 }) => {
    
    const needleClasses = status === 'analyzing'
        ? 'animate-spin-fast'
        : 'transition-transform duration-[3500ms] ease-in-out';

    const rotationStyle = status === 'result' ? { transform: `rotate(${targetAngle}deg)` } : {};

    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            
            {/* Outer decorative rings & glow */}
            <div className="absolute w-full h-full rounded-full bg-slate-800 border-2 border-slate-700"></div>
            <div className={`absolute w-full h-full rounded-full border-2 border-cyan-400/50 transition-all duration-500 ${status === 'analyzing' ? 'animate-pulse scale-105' : 'scale-95'}`}></div>

            {/* Inner scanner effect */}
            {status === 'analyzing' && (
                <div className="absolute w-[85%] h-[85%] bg-conic-gradient from-cyan-400/50 via-transparent to-cyan-400/50 rounded-full animate-spin-slow"></div>
            )}
            
            {/* Main dial */}
            <div className="relative w-[90%] h-[90%] rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center border-2 border-slate-700 shadow-inner">
            
                {/* Career Path Labels */}
                <div className="absolute w-full h-full">
                    {Object.entries(CAREER_PATHS).map(([path, angle]) => {
                        const isSelected = status === 'result' && angle === targetAngle;
                        
                        return (
                            <div 
                                key={path} 
                                className="absolute w-full h-full" 
                                style={{ transform: `rotate(${angle}deg)` }}
                            >
                                <div 
                                    className={`absolute top-[-20px] left-1/2 -translate-x-1/2 text-center transition-all duration-500 ease-out ${isSelected ? 'text-cyan-300 scale-125 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.9)]' : 'text-slate-400 scale-100 font-normal'}`}
                                    style={{ transformOrigin: 'bottom center' }}
                                >
                                    <span 
                                        style={{ transform: `rotate(${-angle}deg)`}}
                                        className="inline-block text-xs whitespace-nowrap bg-slate-800/50 px-2 py-1 rounded"
                                    >
                                        {path}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            
                {/* Inner circle for needle */}
                <div className="w-[85%] h-[85%] rounded-full bg-gray-900/50 border-2 border-slate-600 flex items-center justify-center shadow-inner">
                     {/* Needle */}
                    <div 
                        className={`absolute w-4 h-3/4 ${needleClasses}`}
                        style={rotationStyle}
                    >
                        {/* Redesigned Needle SVG */}
                        <div className="absolute top-0 w-full h-1/2 flex justify-center">
                             <svg width="24" height="100%" viewBox="0 0 24 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]">
                                <path d="M12 0L0 100L12 120L24 100L12 0Z" fill="url(#needleGradient)"/>
                                <defs>
                                    <linearGradient id="needleGradient" x1="12" y1="0" x2="12" y2="120" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#06b6d4"/>
                                        <stop offset="1" stopColor="#67e8f9"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="absolute bottom-0 w-full h-1/2 flex justify-center">
                             <svg width="24" height="100%" viewBox="0 0 24 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 120L0 20L12 0L24 20L12 120Z" fill="#9ca3af"/>
                            </svg>
                        </div>
                    </div>
                    {/* Needle center pin */}
                    <div className="w-5 h-5 bg-slate-400 rounded-full z-10 border-2 border-slate-300 shadow-md"></div>
                </div>
            </div>
            <style>{`
                @keyframes spin-fast {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast {
                    animation: spin-fast 1s linear infinite;
                }
                 @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                .bg-conic-gradient {
                    background-image: conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
};

export default Compass;
