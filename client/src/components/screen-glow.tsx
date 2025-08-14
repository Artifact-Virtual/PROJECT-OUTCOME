import { useEffect, useState } from 'react';

export const ScreenGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Fixed screen glow overlay - always on top */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {/* Adaptive inner glow that follows mouse */}
        <div
          className={`absolute transition-all duration-300 ease-out ${
            isActive ? 'opacity-30' : 'opacity-10'
          }`}
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: `radial-gradient(circle, 
              rgba(34, 197, 94, 0.15) 0%, 
              rgba(34, 197, 94, 0.08) 25%, 
              rgba(34, 197, 94, 0.04) 50%, 
              transparent 70%
            )`,
            filter: 'blur(40px)',
          }}
        />
        
        {/* Static corner glows for screen authenticity */}
        <div className="absolute top-0 left-0 w-96 h-96 opacity-20">
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 0% 0%, 
                rgba(168, 85, 247, 0.1) 0%, 
                transparent 50%
              )`,
              filter: 'blur(60px)',
            }}
          />
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 100% 0%, 
                rgba(59, 130, 246, 0.1) 0%, 
                transparent 50%
              )`,
              filter: 'blur(60px)',
            }}
          />
        </div>
        
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20">
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 0% 100%, 
                rgba(251, 191, 36, 0.1) 0%, 
                transparent 50%
              )`,
              filter: 'blur(60px)',
            }}
          />
        </div>
        
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-20">
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 100% 100%, 
                rgba(239, 68, 68, 0.1) 0%, 
                transparent 50%
              )`,
              filter: 'blur(60px)',
            }}
          />
        </div>

        {/* Subtle scanlines for authenticity */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(34, 197, 94, 0.1) 2px,
              rgba(34, 197, 94, 0.1) 4px
            )`
          }}
        />

        {/* Inner screen border glow - maximized to screen size */}
        <div 
          className="absolute inset-0 border border-emerald-500/10 pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 50px rgba(34, 197, 94, 0.05),
              inset 0 0 100px rgba(34, 197, 94, 0.02),
              0 0 30px rgba(34, 197, 94, 0.05)
            `
          }}
        />
      </div>
    </>
  );
};