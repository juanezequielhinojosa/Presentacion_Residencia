import React, { useState } from 'react';
import { X, ShoppingBag, Clock, Weight, Layers, ShieldCheck, Box, ExternalLink, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const defaultColor = product.colorOptions?.[0] || 'Original';
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatMoney = (n: number) =>
    '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#131623] border border-[#262b42] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1a1e30] border border-[#262b42] text-[#9aa0b8] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image / visual column */}
          <div className="relative bg-[#0e1018] h-72 md:h-full min-h-[300px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#262b42]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Box className="w-20 h-20 text-[#4f8cff] mb-3 animate-pulse" />
                <span className="text-xs text-[#9aa0b8]">Modelo 3D Paramétrico</span>
              </div>
            )}

            {product.badge && (
              <span className="absolute top-4 left-4 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#9d5cff] text-white shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category / Subtitle */}
              <div className="flex items-center gap-2 text-xs text-[#17e6a3] uppercase tracking-wider font-semibold mb-2">
                <span>{product.material || 'Filamento Premium'}</span>
                <span>·</span>
                <span>{product.dimensions || 'Escala estándar'}</span>
              </div>

              <h2 className="font-display font-bold text-2xl text-white mb-3">
                {product.name}
              </h2>

              <p className="text-sm text-[#9aa0b8] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Technical Print Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-2xl bg-[#1a1e30]/80 border border-[#262b42]">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#4f8cff]" />
                  <div className="text-xs">
                    <span className="text-[#9aa0b8] block">Altura de capa</span>
                    <strong className="text-white font-medium">{product.layerHeight || '0.16 mm'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#17e6a3]" />
                  <div className="text-xs">
                    <span className="text-[#9aa0b8] block">Tiempo de print</span>
                    <strong className="text-white font-medium">{product.printTime || '6 horas'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Weight className="w-4 h-4 text-[#9d5cff]" />
                  <div className="text-xs">
                    <span className="text-[#9aa0b8] block">Peso aprox.</span>
                    <strong className="text-white font-medium">{product.weightGrams ? `${product.weightGrams}g` : '120g'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#17e6a3]" />
                  <div className="text-xs">
                    <span className="text-[#9aa0b8] block">Relleno interior</span>
                    <strong className="text-white font-medium">{product.infill || '20% Gyroid'}</strong>
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              {product.colorOptions && product.colorOptions.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#9aa0b8] uppercase tracking-wider mb-2">
                    Color / Acabado: <span className="text-white capitalize">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          selectedColor === c
                            ? 'bg-[#4f8cff]/20 border-[#4f8cff] text-white font-medium'
                            : 'bg-[#1a1e30] border-[#262b42] text-[#9aa0b8] hover:text-white hover:border-[#9aa0b8]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="pt-4 border-t border-[#262b42] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#9aa0b8] block">Precio final</span>
                <span className="font-display font-extrabold text-2xl text-[#17e6a3]">
                  {formatMoney(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {product.mercadopago_url ? (
                  <a
                    href={product.mercadopago_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009ee3] hover:bg-[#0081bb] text-white font-semibold text-xs transition-colors shadow-md"
                  >
                    <span>Comprar con MercadoPago</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#9d5cff] hover:opacity-95 text-white font-semibold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-[#17e6a3]" />
                        <span>¡Añadido!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Añadir al carrito</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
