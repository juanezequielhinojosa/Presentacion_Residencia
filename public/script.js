(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  // Supabase
  const SUPABASE_URL = 'https://ehuepkuoaepkfyedlant.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9ctmokJS8yxVNMy9LYDf8w_YVg-VCVX';

  let supabaseClient = null;
  try {
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.warn("Error inicializando Supabase:", e);
  }

  // DOM
  const header = $("#header");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const cartToggle = $("#cartToggle");
  const cartClose = $("#cartClose");
  const cartOverlay = $("#cartOverlay");
  const cart = $("#cart");
  const cartItemsEl = $("#cartItems");
  const cartCount = $("#cartCount");
  const cartSubtitle = $("#cartSubtitle");
  const cartClearBtn = $("#cartClearBtn");
  const cartSubtotal = $("#cartSubtotal");
  const cartTotal = $("#cartTotal");
  const checkoutBtn = $("#checkoutBtn");
  const checkoutMsg = $("#checkoutMsg");
  const toast = $("#toast");

  const productGrid = $("#productGrid");
  const productsStatus = $("#productsStatus");

  let cartData = [];

  const save = () => localStorage.setItem("universo3d-cart", JSON.stringify(cartData));
  const load = () => {
    try {
      const raw = localStorage.getItem("universo3d-cart") || localStorage.getItem("3dverse-cart");
      cartData = raw ? JSON.parse(raw) : [];
    } catch {
      cartData = [];
    }
  };

  const formatMoney = (n) => "$" + Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // Header scroll
  const onScroll = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.textContent = "☰";
      })
    );
  }

  // Scroll spy
  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = navLinks ? navLinks.querySelectorAll("a") : [];

  const spy = () => {
    const pos = window.scrollY + 120;
    let current = "";
    sections.forEach((s) => { if (pos >= s.offsetTop) current = s.id; });
    navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // Cart Rendering
  const renderCart = () => {
    if (!cartCount || !cartTotal || !cartItemsEl) return;
    const totalCount = cartData.reduce((sum, it) => sum + it.qty, 0);
    cartCount.textContent = totalCount;
    if (cartSubtitle) {
      cartSubtitle.textContent = totalCount === 0
        ? "0 productos seleccionados"
        : totalCount === 1
        ? "1 producto en tu lista"
        : `${totalCount} productos en tu lista`;
    }

    const total = cartData.reduce((sum, it) => sum + it.price * it.qty, 0);
    cartTotal.textContent = formatMoney(total);
    if (cartSubtotal) cartSubtotal.textContent = formatMoney(total);
    if (checkoutMsg) checkoutMsg.textContent = "";

    if (!cartData.length) {
      cartItemsEl.innerHTML = `
        <li class="cart-empty-state">
          <div class="empty-icon-box">🛒</div>
          <h4>Tu carrito está vacío</h4>
          <p>Explora el catálogo, selecciona las piezas 3D que más te gusten y aparecerán aquí con todos sus detalles listos para pedir.</p>
        </li>
      `;
      return;
    }

    cartItemsEl.innerHTML = "";
    cartData.forEach((item, i) => {
      const lineSubtotal = item.price * item.qty;
      const li = document.createElement("li");
      li.className = "cart-item-card";

      const thumbHtml = item.image_url
        ? `<img src="${item.image_url}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'thumb-placeholder\\'>🧩</div>';">`
        : `<div class="thumb-placeholder">🧩</div>`;

      li.innerHTML = `
        <div class="cart-item-thumb">
          ${thumbHtml}
        </div>
        <div class="cart-item-content">
          <div class="cart-item-header">
            <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
            <button class="cart-item-del-btn" data-act="del" data-index="${i}" title="Eliminar producto" aria-label="Eliminar ${item.name}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>

          <div class="cart-item-specs">
            <span class="cart-item-badge">${item.material || "PLA+ Pro"}</span>
            <span class="cart-item-unit">Unitario: <strong>${formatMoney(item.price)}</strong></span>
          </div>

          <div class="cart-item-actions-row">
            <div class="qty-stepper">
              <button class="qty-btn" data-act="dec" data-index="${i}" aria-label="Restar una unidad" title="Disminuir">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" data-act="inc" data-index="${i}" aria-label="Sumar una unidad" title="Aumentar">+</button>
            </div>
            <div class="cart-item-subtotal">
              <span class="subtotal-label">Subtotal:</span>
              <strong class="subtotal-val">${formatMoney(lineSubtotal)}</strong>
            </div>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
  };

  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const i = +btn.dataset.index;
      const act = btn.dataset.act;
      if (act === "inc") {
        cartData[i].qty += 1;
      } else if (act === "dec") {
        cartData[i].qty -= 1;
        if (cartData[i].qty <= 0) {
          cartData.splice(i, 1);
        }
      } else if (act === "del") {
        const removedName = cartData[i].name;
        cartData.splice(i, 1);
        showToast(`"${removedName}" eliminado del carrito`);
      }
      save();
      renderCart();
    });
  }

  if (cartClearBtn) {
    cartClearBtn.addEventListener("click", () => {
      if (!cartData.length) return;
      if (confirm("¿Seguro que deseas vaciar todos los productos del carrito?")) {
        cartData = [];
        save();
        renderCart();
        showToast("Carrito vaciado ✓");
      }
    });
  }

  const openCart = () => {
    if (cart) cart.classList.add("open");
    if (cartOverlay) cartOverlay.classList.add("open");
  };
  const closeCart = () => {
    if (cart) cart.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("open");
  };

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  // WhatsApp destination number (Argentina international format: +54 9 3888202559)
  const WHATSAPP_TARGET = "5493888202559";

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!cartData.length) {
        showToast("Tu carrito está vacío 🛒 Añade algún producto primero.");
        return;
      }

      const total = cartData.reduce((s, it) => s + it.price * it.qty, 0);
      const totalItems = cartData.reduce((s, it) => s + it.qty, 0);

      const nameVal = $("#orderName") ? $("#orderName").value.trim() : "";
      const deliveryVal = $("#orderDelivery") ? $("#orderDelivery").value : "Envío a domicilio express";
      const addressVal = $("#orderAddress") ? $("#orderAddress").value.trim() : "";
      const notesVal = $("#orderNotes") ? $("#orderNotes").value.trim() : "";

      // Format clean message for WhatsApp
      let msg = `👋 *¡Hola Taller Universo 3D! Quiero realizar el siguiente pedido:*%0A%0A`;
      msg += `📦 *DETALLE DE LA COMPRA (${totalItems} artículos):*%0A`;
      msg += `━━━━━━━━━━━━━━━━━━━━━%0A`;

      cartData.forEach((it, idx) => {
        const subtotal = it.price * it.qty;
        msg += `${idx + 1}. *${it.name}*%0A`;
        msg += `   • Cantidad: *${it.qty} unidad(es)*%0A`;
        msg += `   • Precio unitario: ${formatMoney(it.price)}%0A`;
        msg += `   • Subtotal: *${formatMoney(subtotal)}*%0A%0A`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━━%0A`;
      msg += `💰 *TOTAL FINAL A PAGAR: ${formatMoney(total)}*%0A%0A`;

      msg += `👤 *DATOS DEL COMPRADOR / ENTREGA:*%0A`;
      msg += `• *Nombre:* ${nameVal || "Cliente Web"}%0A`;
      msg += `• *Modalidad:* ${deliveryVal}%0A`;
      if (addressVal) {
        msg += `• *Dirección / Ciudad:* ${addressVal}%0A`;
      }
      if (notesVal) {
        msg += `• *Notas / Colores:* ${notesVal}%0A`;
      }

      msg += `%0A📅 *Fecha:* ${new Date().toLocaleDateString("es-AR")} ${new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}%0A`;
      msg += `🚀 *Generado desde la tienda Universo 3D*`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_TARGET}&text=${msg}`;

      if (checkoutMsg) {
        checkoutMsg.textContent = "Abriendo WhatsApp con tu pedido... ✓";
      }
      showToast("¡Redirigiendo a WhatsApp con el detalle de tu compra! 🚀");

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Reset cart and form
      cartData = [];
      save();
      renderCart();

      if ($("#orderName")) $("#orderName").value = "";
      if ($("#orderAddress")) $("#orderAddress").value = "";
      if ($("#orderNotes")) $("#orderNotes").value = "";

      setTimeout(closeCart, 1800);
    });
  }

  // Fallback demo products if Supabase table is empty or has RLS policy errors
  const FALLBACK_PRODUCTS = [
    {
      name: "Dragón Articulado Cristal",
      description: "Impreso en una sola pieza con articulaciones móviles fluidas. Acabado sedoso bitono sin ensamblaje.",
      price: 499.00,
      image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
      badge: "✦ Más Vendido",
      rating: "4.9",
      material: "PLA Silk Bicolor",
      layer: "0.12 mm",
      weight: "145g",
      printTime: "9h 45m",
      colors: ["#ffd700", "#9d5cff", "#17e6a3"]
    },
    {
      name: "Maceta Geométrica Voronoi",
      description: "Diseño paramétrico con auto-drenaje integrado. Ideal para suculentas y plantas de interior modernas.",
      price: 320.00,
      image_url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=700&q=80",
      badge: "🌱 Eco Friendly",
      rating: "4.8",
      material: "PLA+ Reciclable",
      layer: "0.16 mm",
      weight: "110g",
      printTime: "6h 15m",
      colors: ["#d9b99b", "#e0e0e0", "#2c3e50"]
    },
    {
      name: "Soporte Auriculares Cyber Minimal",
      description: "Estructura rígida de alta resistencia con canal pasacables oculto y base antideslizante para tu setup.",
      price: 450.00,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      badge: "⚡ Setup Pro",
      rating: "5.0",
      material: "PETG Reforzado",
      layer: "0.20 mm",
      weight: "230g",
      printTime: "8h 20m",
      colors: ["#1e1e24", "#f7f7f7", "#4f8cff"]
    },
    {
      name: "Lámpara Lunar Litofanía LED",
      description: "Esfera lunar 3D con relieve topográfico real capturado por la NASA. Incluye base geométrica y luz cálida.",
      price: 680.00,
      image_url: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=700&q=80",
      badge: "🌙 Edición Lunar",
      rating: "4.9",
      material: "PLA Blanco Lunar",
      layer: "0.12 mm",
      weight: "280g",
      printTime: "14h 30m",
      colors: ["#ffffff", "#f5e6c8"]
    },
    {
      name: "Busto Escultura David Cyberpunk",
      description: "Clásico renacentista reinterpretado con polígonos facetados. Micro-resolución fotopolimérica ultra nítida.",
      price: 790.00,
      image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=700&q=80",
      badge: "💎 Resina 4K",
      rating: "5.0",
      material: "Resina Fotosensible",
      layer: "0.05 mm",
      weight: "190g",
      printTime: "11h 00m",
      colors: ["#3a3d40", "#0f0f14", "#d6dbe0"]
    },
    {
      name: "Cubo Antiestrés Mecánico Engranajes",
      description: "Mecanismo planetario de rotación infinita. Impresión de tolerancia milimétrica para un giro suave.",
      price: 240.00,
      image_url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=700&q=80",
      badge: "⚙️ Mecanismo",
      rating: "4.7",
      material: "PLA+ Dureza",
      layer: "0.12 mm",
      weight: "75g",
      printTime: "4h 10m",
      colors: ["#e63946", "#1d3557", "#2a9d8f"]
    },
    {
      name: "Dock Cargador Inalámbrico MagSafe",
      description: "Base angular para smartphone con ranura precisa para cargador magnético y ángulo ergonómico para escritorio.",
      price: 360.00,
      image_url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80",
      badge: "📱 Ergonómico",
      rating: "4.8",
      material: "PETG Mate",
      layer: "0.16 mm",
      weight: "130g",
      printTime: "5h 40m",
      colors: ["#141414", "#ffffff", "#4a4e69"]
    },
    {
      name: "Pack STL Maker: Organizadores Modulares",
      description: "Archivos digitales .STL pre-orientados y testeados para corte en Cura, Bambu Studio y PrusaSlicer.",
      price: 180.00,
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80",
      badge: "📐 Archivo STL",
      rating: "5.0",
      material: "Digital .STL / .STEP",
      layer: "Recom. 0.20mm",
      weight: "Digital",
      printTime: "Descarga Inmediata",
      colors: ["#4f8cff", "#17e6a3"]
    }
  ];

  let currentProductsList = [];

  function openQuickModal(prod) {
    let modal = $("#productModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "productModal";
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-content">
          <button class="modal-close" id="modalClose" aria-label="Cerrar">✕</button>
          <div class="modal-media" id="modalMedia"></div>
          <div class="modal-body">
            <div>
              <span class="modal-tag" id="modalTag"></span>
              <h3 class="modal-title" id="modalTitle"></h3>
              <p class="modal-desc" id="modalDesc"></p>
              <div class="modal-specs-grid">
                <div class="modal-spec-item">
                  <span>Material:</span>
                  <strong id="modalMat"></strong>
                </div>
                <div class="modal-spec-item">
                  <span>Altura de capa:</span>
                  <strong id="modalLayer"></strong>
                </div>
                <div class="modal-spec-item">
                  <span>Peso estimado:</span>
                  <strong id="modalWeight"></strong>
                </div>
                <div class="modal-spec-item">
                  <span>Tiempo de print:</span>
                  <strong id="modalTime"></strong>
                </div>
              </div>
            </div>
            <div class="modal-foot">
              <div class="price-wrap">
                <span class="price-label">Precio final</span>
                <span class="price" id="modalPrice"></span>
              </div>
              <button class="btn btn-primary" id="modalAddBtn">
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.id === "modalClose") {
          modal.classList.remove("open");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
          modal.classList.remove("open");
        }
      });
    }

    $("#modalTag").textContent = prod.badge || prod.material || "Pieza Maker 3D";
    $("#modalTitle").textContent = prod.name;
    $("#modalDesc").textContent = prod.description;
    $("#modalMat").textContent = prod.material || "PLA+";
    $("#modalLayer").textContent = prod.layer || prod.layer_height || "0.16 mm";
    $("#modalWeight").textContent = prod.weight || (prod.weight_grams ? prod.weight_grams + "g" : "125g");
    $("#modalTime").textContent = prod.printTime || prod.print_time || "6 horas";
    $("#modalPrice").textContent = formatMoney(prod.price);

    const mediaEl = $("#modalMedia");
    if (prod.image_url) {
      mediaEl.innerHTML = `<img src="${prod.image_url}" alt="${prod.name}">`;
    } else {
      mediaEl.innerHTML = `<div class="model-preview">🧩</div>`;
    }

    const addBtn = $("#modalAddBtn");
    addBtn.onclick = () => {
      const existing = cartData.find((it) => it.name === prod.name);
      if (existing) {
        existing.qty += 1;
      } else {
        cartData.push({
          name: prod.name,
          price: Number(prod.price),
          qty: 1,
          image_url: prod.image_url || prod.image || "",
          material: prod.material || "PLA+ Pro"
        });
      }
      save();
      renderCart();
      showToast(prod.name + " añadido al carrito ✓");
      modal.classList.remove("open");
    };

    modal.classList.add("open");
  }

  function renderProductList(items, statusNote) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    if (productsStatus) productsStatus.textContent = statusNote || "";
    currentProductsList = items;

    items.forEach((prod, index) => {
      const article = document.createElement("article");
      article.className = "card reveal visible";

      const name = prod.name || prod.title || prod.product_name || "Producto 3D";
      const description = prod.description || prod.desc || "";
      const price = Number(prod.price || prod.precio || 0);
      const imageUrl = prod.image_url || prod.image || prod.img_url || prod.photo_url || "";
      const mpUrl = prod.mercadopago_url || prod.mercadopago || prod.mp_url || null;

      const badge = prod.badge || (index === 0 ? "✦ Más Vendido" : "✨ Calidad Taller");
      const rating = prod.rating || "4.9";
      const material = prod.material || "PLA+ Pro";
      const layer = prod.layer || prod.layer_height || "0.16 mm";
      const weight = prod.weight || (prod.weight_grams ? prod.weight_grams + "g" : "125g");

      const colors = prod.colors || ["#4f8cff", "#9d5cff", "#17e6a3"];
      const colorDotsHtml = colors.map(c => `<span class="color-dot" style="background-color: ${c}" title="Variante disponible"></span>`).join("") + '<span class="color-dot-more">+ Colores</span>';

      const imgHtml = imageUrl
        ? `<img src="${imageUrl}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'model-preview\\'>🧩</div>';">`
        : `<div class="model-preview">🧩</div>`;

      const btnHtml = mpUrl
        ? `<a class="btn btn-small btn-mp" href="${mpUrl}" target="_blank" rel="noopener noreferrer">Comprar MP</a>`
        : `<button class="add-cart" data-name="${String(name).replace(/"/g, '&quot;')}" data-price="${price}">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
             <span>Añadir</span>
           </button>`;

      article.innerHTML = `
        <div class="card-img" data-idx="${index}" title="Haz clic para ver especificaciones y detalles 3D">
          ${imgHtml}
          <span class="card-badge">${badge}</span>
          <span class="card-rating"><span>★</span> ${rating}</span>
          <span class="card-quick-view">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver pieza 3D
          </span>
        </div>
        <div class="card-body">
          <div class="card-specs">
            <span>${material}</span>
            <span class="spec-dot">·</span>
            <span class="spec-layer">${layer}</span>
            <span class="spec-dot">·</span>
            <span>${weight}</span>
          </div>
          <h3 data-idx="${index}" title="Ver especificaciones de ${name}">${name}</h3>
          <p>${description}</p>
          <div class="card-colors">
            ${colorDotsHtml}
          </div>
        </div>
        <div class="card-foot">
          <div class="price-wrap">
            <span class="price-label">Precio</span>
            <span class="price">${formatMoney(price)}</span>
          </div>
          ${btnHtml}
        </div>
      `;

      // Click on image or title triggers quick view modal
      article.querySelector(".card-img").addEventListener("click", () => openQuickModal(prod));
      article.querySelector("h3").addEventListener("click", () => openQuickModal(prod));

      productGrid.appendChild(article);
      if (observer) observer.observe(article);
    });
  }

  async function loadProducts() {
    if (!productGrid) return;

    if (!supabaseClient) {
      renderProductList(FALLBACK_PRODUCTS, "");
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("Aviso al consultar Supabase:", error.message);
        renderProductList(FALLBACK_PRODUCTS, "");
        return;
      }

      if (!data || data.length === 0) {
        renderProductList(FALLBACK_PRODUCTS, "");
        return;
      }

      renderProductList(data, "");
    } catch (err) {
      console.error("Error cargando productos:", err);
      renderProductList(FALLBACK_PRODUCTS, "");
    }
  }

  if (productGrid) {
    productGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-cart");
      if (!btn) return;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const prod = currentProductsList.find((p) => (p.name || p.title) === name) || {};
      const existing = cartData.find((it) => it.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cartData.push({
          name,
          price,
          qty: 1,
          image_url: prod.image_url || prod.image || prod.img_url || "",
          material: prod.material || "PLA+ Pro"
        });
      }
      save();
      renderCart();

      // Button feedback animation
      btn.classList.add("added");
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<span>✓ ¡Añadido!</span>`;
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = originalHtml;
      }, 1400);

      showToast(name + " añadido al carrito ✓");
    });
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll(".section-head, .feature, .card").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // Newsletter subscription
  const newsletterForm = $("#newsletterForm");
  const newsletterEmail = $("#newsletterEmail");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : "";
      if (email) {
        showToast("¡Bienvenido al Club Maker! Te enviamos tu primer STL 🚀");
        if (newsletterEmail) newsletterEmail.value = "";
      }
    });
  }

  load();
  renderCart();
  loadProducts();
})();
