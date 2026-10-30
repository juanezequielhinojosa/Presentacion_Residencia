import React from 'react';
import { Sparkles, Recycle, Compass, Layers, Award, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: Compass,
      title: 'Diseño propio & parametrizado',
      desc: 'Modelamos cada pieza en software CAD/Blender desde cero, calculando contracciones térmicas y holguras milimétricas.',
    },
    {
      icon: Recycle,
      title: 'Producción consciente & residuo cero',
      desc: 'Reutilizamos bobinas, reciclamos los soportes de impresión y priorizamos biopolímeros con baja huella de carbono.',
    },
    {
      icon: Sparkles,
      title: 'Atención cercana de maker a maker',
      desc: 'Te acompañamos desde la idea inicial hasta el post-procesado final. Si necesitas ajustes de escala o color, lo resolvemos.',
    },
  ];

  return (
    <section id="nosotros" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Values */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#262b42] bg-[#131623] text-xs font-semibold text-[#17e6a3] uppercase tracking-wider mb-4">
              <span>Nuestra Historia</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-6">
              Detrás de cada capa
            </h2>

            <p className="text-base text-[#9aa0b8] leading-relaxed mb-4">
              Nacimos en 2019 con una sola impresora, una mesa de trabajo y la obsesión por los acabados limpios. Hoy ayudamos a makers, diseñadores industriales, arquitectos y coleccionistas a materializar figuras, decoración, prototipos y piezas funcionales.
            </p>

            <p className="text-base text-[#9aa0b8] leading-relaxed mb-8">
              Cada pedido pasa por una rigurosa revisión de slice, control de retracción y verificación de calidad manual. No vendemos series masivas impersonales: fabricamos piezas que merecen un lugar de honor en tu setup o tu hogar.
            </p>

            {/* Values List */}
            <div className="space-y-4">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#131623] border border-[#262b42] flex items-start gap-4 hover:border-[#4f8cff]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#4f8cff]/10 border border-[#4f8cff]/30 flex items-center justify-center text-[#4f8cff] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white mb-1">
                        {val.title}
                      </h4>
                      <p className="text-xs text-[#9aa0b8] leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Workshop Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1e30] to-[#131623] border border-[#262b42] p-8 shadow-2xl overflow-hidden">
              {/* Radial glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#9d5cff]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#17e6a3] bg-[#17e6a3]/10 border border-[#17e6a3]/30 mb-6">
                  Desde 2019
                </div>

                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Taller Universo 3D
                </h3>

                <p className="text-sm text-[#9aa0b8] leading-relaxed mb-8">
                  Un equipo pequeño, impresoras FDM y SLA de última generación calibradas al detalle, y una regla simple: si no nos gustaría exhibirlo en casa, no sale del taller.
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#262b42]">
                  <div>
                    <strong className="block font-display font-extrabold text-2xl text-[#17e6a3]">
                      +12K
                    </strong>
                    <span className="text-xs text-[#9aa0b8]">Pedidos entregados</span>
                  </div>

                  <div>
                    <strong className="block font-display font-extrabold text-2xl text-[#4f8cff]">
                      7
                    </strong>
                    <span className="text-xs text-[#9aa0b8]">Años creando</span>
                  </div>

                  <div>
                    <strong className="block font-display font-extrabold text-2xl text-[#9d5cff]">
                      100%
                    </strong>
                    <span className="text-xs text-[#9aa0b8]">Garantía Taller</span>
                  </div>
                </div>

                {/* Machine Fleet Highlights */}
                <div className="mt-8 pt-6 border-t border-[#262b42]/80 space-y-2.5 text-xs text-[#9aa0b8]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#17e6a3]" />
                    <span>Granja FDM con nivelación por sensor de carga</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#17e6a3]" />
                    <span>Cámaras fotopoliméricas SLA mono 4K / 8K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#17e6a3]" />
                    <span>Estación de lavado y curado UV controlado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
