import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WastelandCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'terminal' | 'rusted' | 'radiation';
  glow?: boolean;
  animated?: boolean;
}

export const WastelandCard = ({ 
  children, 
  className, 
  variant = 'default',
  glow = false,
  animated = false
}: WastelandCardProps) => {
  const baseClasses = "relative overflow-hidden";
  
  const variantClasses = {
    default: "bg-rusted-metal border-2 border-wasteland-orange shadow-wasteland",
    terminal: "bg-charred-earth border-2 border-rust-red pip-boy-screen",
    rusted: "bg-corroded-steel border-2 border-burnt-amber rust-texture",
    radiation: "bg-deeper-void border-2 border-radiation-green radiation-glow animate-radiation-pulse"
  };

  const glowClass = glow ? "shadow-2xl shadow-wasteland-orange/50" : "";
  const animatedClass = animated ? "animate-hologram-flicker" : "";

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      glowClass,
      animatedClass,
      className
    )}>
      {/* Card background texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-wasteland-orange/5 to-rust-red/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface WastelandButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'radiation';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  glitch?: boolean;
}

export const WastelandButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  glitch = false
}: WastelandButtonProps) => {
  const baseClasses = "relative font-title uppercase tracking-wider transition-all duration-300 border-2 overflow-hidden";
  
  const variantClasses = {
    primary: "bg-wasteland-orange text-dark-wasteland border-wasteland-orange hover:bg-rust-red hover:border-rust-red",
    secondary: "bg-transparent text-wasteland-orange border-wasteland-orange hover:bg-wasteland-orange hover:text-dark-wasteland",
    danger: "bg-rust-red text-foreground border-rust-red hover:bg-blood-maroon hover:border-blood-maroon",
    radiation: "bg-radiation-green text-dark-wasteland border-radiation-green hover:bg-toxic-yellow hover:border-toxic-yellow animate-radiation-pulse"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const glitchClass = glitch ? "animate-wasteland-glitch" : "";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        glitchClass,
        className
      )}
      onClick={disabled ? undefined : onClick}
      data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Button glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative z-10 text-shadow-wasteland">
        {children}
      </span>
    </button>
  );
};

interface WastelandTextProps {
  children: ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'terminal' | 'warning';
  glow?: boolean;
  glitch?: boolean;
  className?: string;
}

export const WastelandText = ({
  children,
  variant = 'body',
  glow = false,
  glitch = false,
  className
}: WastelandTextProps) => {
  const variantClasses = {
    title: "font-title text-4xl md:text-6xl text-wasteland-orange font-bold uppercase tracking-widest",
    subtitle: "font-title text-2xl md:text-3xl text-burnt-amber font-semibold uppercase tracking-wide",
    body: "font-body text-base text-foreground",
    terminal: "font-mono text-sm text-radiation-green bg-charred-earth/20 px-2 py-1 border border-radiation-green/30",
    warning: "font-title text-lg text-toxic-yellow font-bold uppercase tracking-wide"
  };

  const glowClass = glow ? "text-shadow-wasteland" : "";
  const glitchClass = glitch ? "glitch-wasteland animate-wasteland-glitch" : "";

  const Component = variant === 'title' ? 'h1' : 
                  variant === 'subtitle' ? 'h2' : 
                  variant === 'terminal' ? 'code' :
                  'p';

  return (
    <Component 
      className={cn(
        variantClasses[variant],
        glowClass,
        glitchClass,
        className
      )}
      data-text={glitch ? children?.toString() : undefined}
    >
      {children}
    </Component>
  );
};

interface WastelandProgressProps {
  value: number;
  max: number;
  label?: string;
  variant?: 'health' | 'radiation' | 'xp' | 'ammo';
  className?: string;
}

export const WastelandProgress = ({
  value,
  max,
  label,
  variant = 'health',
  className
}: WastelandProgressProps) => {
  const percentage = (value / max) * 100;
  
  const variantClasses = {
    health: "bg-rust-red",
    radiation: "bg-radiation-green animate-radiation-pulse",
    xp: "bg-burnt-amber",
    ammo: "bg-steel-blue"
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-sm font-mono text-ash-gray mb-1">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className="relative h-3 bg-charred-earth border border-ash-gray overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 rust-texture opacity-30" />
        
        {/* Progress bar */}
        <div
          className={cn(
            "relative h-full transition-all duration-500 border-r border-current/50",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
          
          {/* Animated fill effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[pip-boy-scan_2s_ease-in-out_infinite]" />
        </div>
        
        {/* Terminal-style overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};