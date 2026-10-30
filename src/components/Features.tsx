import React from 'react';
import { Cpu, Leaf, Truck, PenTool, CheckCircle, ArrowRight } from 'lucide-react';

interface FeaturesProps {
  onOpenCalculator: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onOpenCalculator }) => {
  const features = [
    {
      title: 'Alta precisión milimétrica',
      desc: 'Resolución de capa de hasta 0.05mm para detalles nítidos en figuras, microtexturas y encastres perfectos.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      icon: Cpu,
      color: 'from-[#4f8cff] to-[#9d5cff]',
      bullet: 'Tolerancias mecánicas ±0.08mm',
    },
    {
      title: 'Materiales ecológicos certificados',
      desc: 'Filamentos PLA+ derivados de almidón de maíz biodegradable, PETG reciclable y resinas vegetales de bajo olor.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      icon: Leaf,
      color: 'from-[#17e6a3] to-[#4f8cff]',
      bullet: 'Cero toxicidad & apto interiores',
    },
    {
      title: 'Envío seguro y express',
      desc: 'Embalaje a prueba de golpes con espuma de polietileno personalizada. Envíos nacionales en 24 a 48 horas con guía.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      icon: Truck,
      color: 'from-[#4f8cff] to-[#17e6a3]',
      bullet: 'Seguimiento en tiempo real',
    },
    {
      title: 'Diseño e ingeniería a medida',
      desc: '¿No tienes el modelo 3D? Modelamos desde un boceto en papel, una pieza rota o adaptamos archivos STL existentes.',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      icon: PenTool,
      color: 'from-[#9d5cff] to-[#4f8cff]',
      bullet: 'Asesoría técnica sin costo',
    },
  ];

  return (
    <section id="caracteristicas" className="py-24 bg-[#0e1018]/70 border-y border-[#262b42]/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#262b42] bg-[#131623] text-xs font-semibold text-[#17e6a3] uppercase tracking-wider mb-4">
            <span>Por qué elegirnos</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Precisión que se puede tocar
          </h2>
          <p className="text-[#9aa0b8] text-base leading-relaxed">
            Cada pieza se imprime con calibración milimétrica, control de flujo volumétrico y revisión artesanal previa al despacho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <article
                key={idx}
                className="bg-[#131623] border border-[#262b42] rounded-3xl overflow-hidden hover:border-[#17e6a3]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Media */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#08090f]">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131623] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-[#08090f]/90 border border-[#262b42] backdrop-blur-md flex items-center justify-center text-white shadow-md group-hover:border-[#17e6a3]/50 transition-colors">
                      <Icon className="w-5 h-5 text-[#17e6a3]" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#4f8cff] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#9aa0b8] leading-relaxed mb-4">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#17e6a3] py-2 px-3 rounded-xl bg-[#17e6a3]/10 border border-[#17e6a3]/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{feat.bullet}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Custom banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#131623] to-[#1a1e30] border border-[#262b42] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4f8cff]/10 border border-[#4f8cff]/30 flex items-center justify-center text-[#4f8cff] shrink-0">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base sm:text-lg">
                ¿Tienes un archivo STL o un proyecto especial?
              </h4>
              <p className="text-xs text-[#9aa0b8]">
                Utiliza nuestro cotizador interactivo para obtener un presupuesto en segundos con tu material preferido.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCalculator}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#17e6a3] to-[#4f8cff] text-[#08090f] font-bold text-xs shadow-lg hover:opacity-95 transition-opacity"
          >
            <span>Abrir cotizador</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
