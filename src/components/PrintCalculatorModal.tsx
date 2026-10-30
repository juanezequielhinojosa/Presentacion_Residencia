import React, { useState, useId } from 'react';
import { X, Calculator, Sparkles, MessageCircle, Copy, Check, Clock, ShieldAlert } from 'lucide-react';
import { QuoteData } from '../types';

interface PrintCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintCalculatorModal: React.FC<PrintCalculatorModalProps> = ({ isOpen, onClose }) => {
  const weightInputId = useId();
  const infillInputId = useId();
  const quantityInputId = useId();
  const notesInputId = useId();

  const [quote, setQuote] = useState<QuoteData>({
    material: 'PLA+',
    weightGrams: 85,
    infillPercent: 20,
    quality: 'standard',
    finish: 'raw',
    quantity: 1,
    notes: '',
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Material rates ($ per gram)
  const materialRates: Record<string, { pricePerGram: number; timeFactor: number }> = {
    'PLA+': { pricePerGram: 2.2, timeFactor: 1.0 },
    'PETG': { pricePerGram: 2.8, timeFactor: 1.1 },
    'Resina 4K': { pricePerGram: 5.2, timeFactor: 1.5 },
    'ABS': { pricePerGram: 3.0, timeFactor: 1.15 },
    'TPU 95A': { pricePerGram: 4.5, timeFactor: 1.8 },
    'Nylon CF': { pricePerGram: 6.8, timeFactor: 2.0 },
  };

  const currentMat = materialRates[quote.material] || materialRates['PLA+'];

  // Base machine hourly rate & setup fee
  const setupFee = 80;
  const qualityMultiplier = quote.quality === 'ultra' ? 1.4 : quote.quality === 'draft' ? 0.8 : 1.0;
  const finishFee = quote.finish === 'painted' ? 220 : quote.finish === 'primed' ? 90 : 0;

  // Calculate estimated print hours
  const estimatedHours = Math.max(
    1.5,
    (quote.weightGrams * 0.08 * currentMat.timeFactor * qualityMultiplier * (1 + quote.infillPercent / 200))
  );

  // Unit Price
  const materialCost = quote.weightGrams * currentMat.pricePerGram;
  const machineCost = estimatedHours * 35; // $35/hour machine wear + energy
  const singleUnitPrice = Math.round(setupFee + materialCost + machineCost + finishFee);
  const totalPrice = singleUnitPrice * quote.quantity;

  const hoursDisplay = `${Math.floor(estimatedHours)}h ${Math.round((estimatedHours % 1) * 60)}m`;

  const handleCopyQuote = () => {
    const text = `🛠️ *Cotización Universo 3D*\n- Material: ${quote.material}\n- Peso aprox: ${quote.weightGrams}g\n- Relleno: ${quote.infillPercent}%\n- Calidad: ${quote.quality}\n- Acabado: ${quote.finish}\n- Cantidad: ${quote.quantity} pza(s)\n- Tiempo est.: ${hoursDisplay}\n*Total estimado: $${totalPrice.toLocaleString('es-MX')} MXN*`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Taller Universo 3D! 👋 Quisiera cotizar una pieza personalizada:\n- Material: ${quote.material}\n- Peso: ${quote.weightGrams}g aprox\n- Calidad: ${quote.quality}\n- Cantidad: ${quote.quantity}\n- Notas: ${quote.notes || 'Adjunto archivo 3D'}\n- Cotización estimada en web: $${totalPrice.toLocaleString('es-MX')} MXN`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#131623] border border-[#262b42] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 my-8 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1a1e30] border border-[#262b42] text-[#9aa0b8] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#17e6a3]/10 border border-[#17e6a3]/30 flex items-center justify-center text-[#17e6a3]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Cotizador de Impresión 3D
            </h2>
            <p className="text-xs text-[#9aa0b8]">
              Calcula en tiempo real según el material, gramos y acabado de tu pieza
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Material selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa0b8] mb-1.5">
                Material de impresión
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(materialRates).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setQuote({ ...quote, material: mat })}
                    className={`text-xs py-2 px-2.5 rounded-xl border text-center font-medium transition-all ${
                      quote.material === mat
                        ? 'bg-[#4f8cff]/20 border-[#4f8cff] text-white shadow-sm'
                        : 'bg-[#1a1e30] border-[#262b42] text-[#9aa0b8] hover:text-white'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#9aa0b8] mb-1">
                <label htmlFor={weightInputId} className="cursor-pointer">Peso estimado de la pieza</label>
                <span className="text-[#17e6a3] font-mono">{quote.weightGrams} gramos</span>
              </div>
              <input
                id={weightInputId}
                type="range"
                min="10"
                max="500"
                step="5"
                value={quote.weightGrams}
                onChange={(e) => setQuote({ ...quote, weightGrams: Number(e.target.value) })}
                className="w-full accent-[#17e6a3] bg-[#1a1e30] h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#9aa0b8] flex justify-between mt-0.5">
                <span>10g (pequeña)</span>
                <span>250g (mediana)</span>
                <span>500g (grande)</span>
              </span>
            </div>

            {/* Infill Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#9aa0b8] mb-1">
                <label htmlFor={infillInputId} className="cursor-pointer">Relleno estructural (Infill)</label>
                <span className="text-[#4f8cff] font-mono">{quote.infillPercent}%</span>
              </div>
              <input
                id={infillInputId}
                type="range"
                min="10"
                max="100"
                step="5"
                value={quote.infillPercent}
                onChange={(e) => setQuote({ ...quote, infillPercent: Number(e.target.value) })}
                className="w-full accent-[#4f8cff] bg-[#1a1e30] h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#9aa0b8] flex justify-between mt-0.5">
                <span>15% (Deco)</span>
                <span>35% (Mecánico)</span>
                <span>100% (Sólido)</span>
              </span>
            </div>

            {/* Quality Preset */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa0b8] mb-1.5">
                Resolución de capa
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'ultra', label: '0.08mm Ultra' },
                  { id: 'standard', label: '0.16mm Estándar' },
                  { id: 'draft', label: '0.24mm Rápido' },
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuote({ ...quote, quality: q.id as any })}
                    className={`py-2 px-1.5 rounded-xl border text-center font-medium transition-all ${
                      quote.quality === q.id
                        ? 'bg-[#17e6a3]/20 border-[#17e6a3] text-white'
                        : 'bg-[#1a1e30] border-[#262b42] text-[#9aa0b8] hover:text-white'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-1">
              <label htmlFor={quantityInputId} className="text-xs font-semibold text-[#9aa0b8] cursor-pointer">
                Cantidad de copias
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuote({ ...quote, quantity: Math.max(1, quote.quantity - 1) })}
                  className="w-7 h-7 rounded-lg bg-[#1a1e30] border border-[#262b42] text-white font-bold hover:bg-[#262b42]"
                >
                  -
                </button>
                <input
                  id={quantityInputId}
                  aria-label="Cantidad de copias"
                  type="number"
                  min="1"
                  max="100"
                  value={quote.quantity}
                  onChange={(e) => setQuote({ ...quote, quantity: Math.max(1, Number(e.target.value)) })}
                  className="w-12 text-center text-xs font-mono font-bold bg-[#1a1e30] border border-[#262b42] rounded-lg py-1 text-white"
                />
                <button
                  type="button"
                  onClick={() => setQuote({ ...quote, quantity: quote.quantity + 1 })}
                  className="w-7 h-7 rounded-lg bg-[#1a1e30] border border-[#262b42] text-white font-bold hover:bg-[#262b42]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="flex flex-col justify-between bg-[#1a1e30]/80 border border-[#262b42] p-6 rounded-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#262b42]">
                <span className="text-xs uppercase tracking-wider text-[#9aa0b8] font-semibold">Resumen técnico</span>
                <span className="text-[11px] text-[#17e6a3] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hoursDisplay} / unidad
                </span>
              </div>

              <div className="space-y-2 py-4 text-xs text-[#9aa0b8]">
                <div className="flex justify-between">
                  <span>Material ({quote.material}):</span>
                  <span className="text-white">${Math.round(materialCost)} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo de máquina calibrada:</span>
                  <span className="text-white">${Math.round(machineCost)} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Preparación de cama & slice:</span>
                  <span className="text-white">${setupFee} MXN</span>
                </div>
                {quote.quantity > 1 && (
                  <div className="flex justify-between pt-2 border-t border-[#262b42]/60 font-medium">
                    <span>Unidades ({quote.quantity}):</span>
                    <span className="text-[#17e6a3]">x{quote.quantity}</span>
                  </div>
                )}
              </div>

              {/* Notes input */}
              <div className="mt-2">
                <label htmlFor={notesInputId} className="block text-[11px] text-[#9aa0b8] mb-1 cursor-pointer">
                  Notas / Detalles del archivo (opcional):
                </label>
                <textarea
                  id={notesInputId}
                  rows={2}
                  placeholder="Ej: Necesito rosca M4 reforzada o color gris grafito..."
                  value={quote.notes}
                  onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                  className="w-full text-xs bg-[#131623] border border-[#262b42] rounded-xl p-2.5 text-white placeholder-[#9aa0b8]/50 focus:outline-none focus:border-[#4f8cff]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#262b42] mt-4">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-[#9aa0b8]">Total estimado:</span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#17e6a3]">
                  ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs text-[#9aa0b8] font-normal ml-1">MXN</span>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#17e6a3] to-[#4f8cff] text-[#08090f] font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar proyecto a WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="w-full py-2 px-4 rounded-xl bg-[#131623] hover:bg-[#262b42] border border-[#262b42] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#17e6a3]" />
                      <span>¡Resumen copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar desglose</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#9aa0b8]/70 text-center mt-3 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3 h-3 text-[#17e6a3]" />
                <span>Revisamos gratis tu archivo STL para asegurar imprimibilidad</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
