import React, { useState } from 'react';
import { MATERIALS_LIST } from '../data/defaultProducts';
import { Info } from 'lucide-react';

export const MaterialsBanner: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  return (
    <section className="py-12 border-y border-[#262b42]/70 bg-[#0e1018]/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase font-bold tracking-widest text-[#9aa0b8] mb-1">
            Materiales y filamentos de última generación
          </p>
          <p className="text-xs text-[#9aa0b8]/80">
            Trabajamos con polímeros certificados y resinas fotopoliméricas de grado industrial
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {MATERIALS_LIST.map((mat) => {
            const isSelected = selectedMaterial === mat.name;
            return (
              <div
                key={mat.name}
                onClick={() => setSelectedMaterial(isSelected ? null : mat.name)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                  isSelected
                    ? 'bg-[#1a1e30] border-[#4f8cff] shadow-[0_0_20px_rgba(79,140,255,0.25)]'
                    : 'bg-[#131623]/80 border-[#262b42] hover:border-[#4f8cff]/50 hover:bg-[#1a1e30]/50'
                }`}
              >
                <span className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">
                  {mat.icon}
                </span>
                <span className="font-display font-bold text-sm text-white group-hover:text-[#4f8cff] transition-colors">
                  {mat.name}
                </span>
                <span className="text-[11px] text-[#9aa0b8] mt-1 line-clamp-1">{mat.desc}</span>
                <span className="mt-2 text-[10px] font-mono text-[#17e6a3] px-2 py-0.5 rounded-md bg-[#17e6a3]/10">
                  {mat.temp}
                </span>
              </div>
            );
          })}
        </div>

        {selectedMaterial && (
          <div className="mt-6 p-4 rounded-xl bg-[#131623] border border-[#4f8cff]/40 max-w-xl mx-auto flex items-start gap-3 text-xs text-[#eef0f7] animate-in fade-in duration-200">
            <Info className="w-4 h-4 text-[#4f8cff] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Detalle de {selectedMaterial}:</strong>{' '}
              {MATERIALS_LIST.find((m) => m.name === selectedMaterial)?.desc}. Calibrado para tolerancias de ±0.1mm en nuestro taller.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
