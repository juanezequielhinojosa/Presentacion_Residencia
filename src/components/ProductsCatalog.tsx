import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, RefreshCw, ExternalLink, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { Product } from '../types';

interface ProductsCatalogProps {
  onAddToCart: (product: Product) => void;
  onOpenProductModal: (product: Product) => void;
}

export const ProductsCatalog: React.FC<ProductsCatalogProps> = ({ onAddToCart, onOpenProductModal }) => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'default'>('default');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Supabase products error (using default catalog):', error.message);
        setProducts(DEFAULT_PRODUCTS);
        setDataSource('default');
        setStatusMessage('Conectado al catálogo base del taller');
      } else if (data && data.length > 0) {
        // Map Supabase rows
        const mapped: Product[] = data.map((prod: any, idx: number) => ({
          id: prod.id || idx + 1,
          name: prod.name || prod.title || prod.product_name || 'Pieza Impresa 3D',
          description: prod.description || prod.desc || 'Pieza de alta calidad fabricada capa por capa con materiales de última generación.',
          price: Number(prod.price || prod.precio || 250),
          image_url: prod.image_url || prod.image || prod.img_url || prod.photo_url || DEFAULT_PRODUCTS[idx % DEFAULT_PRODUCTS.length]?.image_url,
          mercadopago_url: prod.mercadopago_url || prod.mercadopago || prod.mp_url || null,
          category: prod.category || (idx % 2 === 0 ? 'figuras' : 'decoracion'),
          badge: prod.badge || (idx === 0 ? 'Destacado' : undefined),
          material: prod.material || 'PLA+ Biodegradable',
          layerHeight: prod.layer_height || '0.16 mm',
          printTime: prod.print_time || '6 horas',
          weightGrams: prod.weight_grams || 120,
          colorOptions: prod.colors ? (typeof prod.colors === 'string' ? prod.colors.split(',') : prod.colors) : ['Negro Mate', 'Blanco', 'Gris Grafito'],
          dimensions: prod.dimensions || '12 x 12 x 10 cm'
        }));
        setProducts(mapped);
        setDataSource('supabase');
        setStatusMessage(`Cargados ${data.length} productos desde Supabase`);
      } else {
        // Empty table
        setProducts(DEFAULT_PRODUCTS);
        setDataSource('default');
        setStatusMessage('Catálogo base cargado (sin registros en Supabase)');
      }
    } catch (err: any) {
      console.warn('Network error fetching Supabase:', err);
      setProducts(DEFAULT_PRODUCTS);
      setDataSource('default');
      setStatusMessage('Catálogo base del taller activo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos los productos' },
    { id: 'figuras', label: 'Figuras & Coleccionables' },
    { id: 'decoracion', label: 'Decoración & Hogar' },
    { id: 'gadgets', label: 'Gadgets & Setup' },
    { id: 'stl', label: 'Archivos STL' },
  ];

  // Filtering
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        activeCategory === 'todos' ||
        (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured order
    });

  const formatMoney = (n: number) =>
    '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleQuickAdd = (p: Product) => {
    onAddToCart(p);
    setRecentlyAddedId(p.id);
    setTimeout(() => setRecentlyAddedId(null), 1400);
  };

  return (
    <section id="productos" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#262b42] bg-[#131623] text-xs font-semibold text-[#17e6a3] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catálogo Oficial</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Nuestros productos impresos
          </h2>
          <p className="text-[#9aa0b8] text-base leading-relaxed">
            Hecho a mano, capa por capa, con materiales ecológicos, gran resistencia mecánica y acabado profesional.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa0b8]" />
              <input
                type="text"
                placeholder="Buscar por nombre, material o modelo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#131623] border border-[#262b42] text-sm text-white placeholder-[#9aa0b8]/60 focus:outline-none focus:border-[#4f8cff] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9aa0b8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown & Refresh */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-2 text-xs text-[#9aa0b8] bg-[#131623] border border-[#262b42] rounded-2xl px-3 py-2">
                <Filter className="w-3.5 h-3.5" />
                <label htmlFor="catalog-sort" className="hidden sm:inline">Ordenar:</label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
                >
                  <option value="featured" className="bg-[#131623]">Destacados</option>
                  <option value="price-asc" className="bg-[#131623]">Precio: Menor a Mayor</option>
                  <option value="price-desc" className="bg-[#131623]">Precio: Mayor a Menor</option>
                  <option value="name" className="bg-[#131623]">Nombre A-Z</option>
                </select>
              </div>

              <button
                onClick={fetchProducts}
                className="p-2.5 rounded-2xl border border-[#262b42] bg-[#131623] hover:bg-[#1a1e30] text-[#9aa0b8] hover:text-white transition-colors"
                title="Sincronizar con Supabase"
                aria-label="Recargar catálogo"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4f8cff]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#4f8cff] text-white shadow-[0_4px_16px_rgba(79,140,255,0.35)]'
                    : 'bg-[#131623] text-[#9aa0b8] border border-[#262b42] hover:text-white hover:border-[#4f8cff]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Database Status indicator */}
        <div className="flex items-center justify-between text-xs text-[#9aa0b8] mb-6 px-1">
          <span>Mostrando {filteredProducts.length} productos</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'supabase' ? 'bg-[#17e6a3] shadow-[0_0_8px_#17e6a3]' : 'bg-[#4f8cff]'
              }`}
            />
            <span className="text-[11px]">
              {dataSource === 'supabase' ? 'Supabase en vivo' : 'Catálogo Taller'}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#131623]/50 border border-[#262b42] rounded-3xl p-8">
            <p className="text-lg font-bold text-white mb-2">No se encontraron productos</p>
            <p className="text-sm text-[#9aa0b8] mb-6">
              Intenta cambiar los términos de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('todos');
              }}
              className="text-xs px-4 py-2 rounded-full bg-[#4f8cff] text-white font-medium"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group bg-[#131623] border border-[#262b42] rounded-3xl overflow-hidden hover:border-[#4f8cff]/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-[#0e1018] flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                      ) : (
                        <div className="text-6xl filter drop-shadow-md group-hover:rotate-6 transition-transform">
                          🧩
                        </div>
                      )}

                      {/* Badge if present */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#9d5cff] text-white shadow-md">
                          {product.badge}
                        </span>
                      )}

                      {/* Quick View Button on hover */}
                      <button
                        onClick={() => onOpenProductModal(product)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-semibold text-white"
                      >
                        <span className="px-3.5 py-2 rounded-full bg-[#08090f]/90 border border-[#262b42] flex items-center gap-1.5 hover:bg-[#1a1e30] transition-colors">
                          <Eye className="w-3.5 h-3.5 text-[#17e6a3]" />
                          Ver detalles
                        </span>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-[#9aa0b8] mb-1.5">
                        <span className="font-mono text-[#17e6a3]">{product.material || 'PLA+'}</span>
                        {product.layerHeight && <span>{product.layerHeight}</span>}
                      </div>

                      <h3
                        onClick={() => onOpenProductModal(product)}
                        className="font-display font-bold text-base text-white mb-2 line-clamp-1 hover:text-[#4f8cff] cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#9aa0b8] line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-2 border-t border-[#262b42]/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#9aa0b8] block">Precio</span>
                      <span className="font-display font-bold text-lg text-[#17e6a3]">
                        {formatMoney(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {product.mercadopago_url ? (
                        <a
                          href={product.mercadopago_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#009ee3] hover:bg-[#0081bb] text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <span>MercadoPago</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isJustAdded
                              ? 'bg-[#17e6a3] text-[#04140f]'
                              : 'bg-[#1a1e30] border border-[#262b42] text-white hover:bg-[#4f8cff] hover:border-[#4f8cff]'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Añadido</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#17e6a3]" />
                              <span>Añadir</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
