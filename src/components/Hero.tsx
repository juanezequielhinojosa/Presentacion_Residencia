import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Pause, Dices, Palette, Calculator, ShieldCheck } from 'lucide-react';
import { WORKSHOP_STATS } from '../data/defaultProducts';

interface HeroProps {
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCalculator }) => {
  const [cubeTheme, setCubeTheme] = useState<'blue' | 'cyan' | 'purple'>('blue');
  const [isPaused, setIsPaused] = useState(false);
  const [rollDegree, setRollDegree] = useState<number | null>(null);

  const rollDice = () => {
    // Generate random 3D rotations for a fun dice throw
    const rx = Math.floor(Math.random() * 4) * 90 + 720;
    const ry = Math.floor(Math.random() * 4) * 90 + 720;
    setRollDegree(rx + ry);
    setTimeout(() => {
      setRollDegree(null);
    }, 2000);
  };

  const nextTheme = () => {
    const themes: ('blue' | 'cyan' | 'purple')[] = ['blue', 'cyan', 'purple'];
    const idx = themes.indexOf(cubeTheme);
    setCubeTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <section id="inicio" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#262b42] bg-[#131623]/80 text-xs font-semibold text-[#17e6a3] uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Impresión 3D profesional</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
              Tus ideas cobran <span className="gradient-text">vida</span> en 3D
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9aa0b8] max-w-xl leading-relaxed mb-8">
              Figuras coleccionables, decoración moderna, gadgets funcionales y prototipos mecánicos.
              Diseños únicos con precisión milimétrica, materiales premium y acabados impecables.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <a
                href="#productos"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#9d5cff] text-white font-semibold text-sm shadow-[0_10px_30px_rgba(79,140,255,0.35)] hover:shadow-[0_14px_40px_rgba(79,140,255,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <span>Ver catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-[#262b42] bg-[#131623] hover:bg-[#1a1e30] text-[#eef0f7] hover:border-[#17e6a3]/40 font-semibold text-sm transition-all"
              >
                <Calculator className="w-4 h-4 text-[#17e6a3]" />
                <span>Cotizar a medida</span>
              </button>

              <a
                href="#novedades"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs text-[#9aa0b8] hover:text-white transition-colors"
              >
                <span>Ver video maker</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#262b42]/60 w-full">
              {WORKSHOP_STATS.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display font-extrabold text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4f8cff]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#9aa0b8] mt-1 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Interactive Rotating Dice */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Ambient Background Glow behind dice */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#4f8cff]/20 to-[#9d5cff]/20 blur-3xl pointer-events-none" />

            <div className="relative p-6 sm:p-10 flex flex-col items-center">
              {/* The 3D Cube Scene */}
              <div
                className={`cube-scene cursor-grab active:cursor-grabbing ${
                  cubeTheme === 'cyan' ? 'cube-cyan' : cubeTheme === 'purple' ? 'cube-purple' : ''
                }`}
                onClick={rollDice}
                title="Haz clic para tirar el dado 3D"
              >
                <div
                  className={`cube ${isPaused ? 'paused' : ''}`}
                  style={
                    rollDegree
                      ? {
                          transform: `rotateX(${rollDegree * 1.5}deg) rotateY(${rollDegree * 2.2}deg)`,
                          transition: 'transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        }
                      : undefined
                  }
                >
                  {/* Face 1: Front */}
                  <div className="cube-face cube-face-front">
                    <span className="dot"></span>
                  </div>

                  {/* Face 2: Back */}
                  <div className="cube-face cube-face-back">
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>

                  {/* Face 3: Right */}
                  <div className="cube-face cube-face-right">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>

                  {/* Face 4: Left */}
                  <div className="cube-face cube-face-left">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>

                  {/* Face 5: Top */}
                  <div className="cube-face cube-face-top">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>

                  {/* Face 6: Bottom */}
                  <div className="cube-face cube-face-bottom">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>

              {/* Dice control toolbar */}
              <div className="mt-8 flex items-center gap-2 p-1.5 rounded-full bg-[#131623]/90 border border-[#262b42] shadow-lg backdrop-blur-md">
                <button
                  onClick={rollDice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a1e30] hover:bg-[#262b42] text-white transition-colors"
                  title="Lanzar dado con animación 3D aleatoria"
                >
                  <Dices className="w-3.5 h-3.5 text-[#4f8cff]" />
                  <span>Tirar</span>
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-full text-[#9aa0b8] hover:text-white hover:bg-[#1a1e30] transition-colors"
                  title={isPaused ? 'Reanudar rotación' : 'Pausar rotación'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-[#17e6a3]" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={nextTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#9aa0b8] hover:text-white hover:bg-[#1a1e30] transition-colors"
                  title="Cambiar filamento / color"
                >
                  <Palette className="w-3.5 h-3.5 text-[#9d5cff]" />
                  <span className="capitalize">{cubeTheme}</span>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#9aa0b8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#17e6a3]" />
                <span>Geometría poliédrica 100% calibrada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
