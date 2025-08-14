import { useEffect, useState } from 'react';

export const AtmosphericEffects = () => {
  return (
    <>
      {/* Debris field with floating particles */}
      <div className="debris-field" />
      
      {/* Atmospheric haze for depth */}
      <div className="atmospheric-haze" />
      
      {/* Dynamic dust storm effect */}
      <DustStorm />
      
      {/* Radiation interference static */}
      <RadiationStatic />
    </>
  );
};

const DustStorm = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-ash-gray animate-drift"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.speed * 30}s`,
            animationDelay: `${particle.id * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

const RadiationStatic = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-1 opacity-20"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            hsl(28 85% 55% / 0.01) 1px,
            hsl(28 85% 55% / 0.01) 2px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 1px,
            hsl(15 85% 45% / 0.005) 1px,
            hsl(15 85% 45% / 0.005) 2px
          )
        `,
        backgroundSize: '100px 100px, 50px 50px',
        animation: 'static-interference 8s ease-in-out infinite'
      }}
    />
  );
};

// Parallax background layers component
export const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Far background - slow moving */}
      <div
        className="parallax-layer bg-wasteland-atmosphere opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.1}px) scale(1.1)`,
        }}
      />
      
      {/* Mid background - medium speed */}
      <div
        className="parallax-layer"
        style={{
          background: `
            radial-gradient(ellipse at 60% 30%, hsl(28 85% 20% / 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, hsl(15 85% 25% / 0.15) 0%, transparent 70%)
          `,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      {/* Near foreground - faster */}
      <div
        className="parallax-layer opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 40% 60%, hsl(45 75% 30% / 0.1) 0%, transparent 50%)
          `,
          transform: `translateY(${scrollY * 0.6}px)`,
        }}
      />
    </div>
  );
};

// Terminal scan lines effect
export const ScanLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              hsl(28 85% 55% / 0.03) 2px,
              hsl(28 85% 55% / 0.03) 4px
            )
          `,
          backgroundSize: '100% 4px',
          animation: 'drift 120s linear infinite'
        }}
      />
    </div>
  );
};