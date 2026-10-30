(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  // Supabase
  const SUPABASE_URL = 'https://ehuepkuoaepkfyedlant.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9ctmokJS8yxVNMy9LYDf8w_YVg-VCVX';

  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
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

  // Scroll spy
  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = navLinks.querySelectorAll("a");

  const spy = () => {
    const pos = window.scrollY + 120;
    let current = "";
    sections.forEach((s) => { if (pos >= s.offsetTop) current = s.id; });
    navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // Cart
  const renderCart = () => {
    cartCount.textContent = cartData.reduce((sum, it) => sum + it.qty, 0);
    const total = cartData.reduce((sum, it) => sum + it.price * it.qty, 0);
    cartTotal.textContent = formatMoney(total);
    checkoutMsg.textContent = "";

    if (!cartData.length) {
      cartItemsEl.innerHTML = '<li class="cart-empty">Tu carrito está vacío 🛒</li>';
      return;
    }

    cartItemsEl.innerHTML = "";
    cartData.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${formatMoney(item.price)}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-act="dec" data-index="${i}">−</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" data-act="inc" data-index="${i}">+</button>
          <button class="qty-btn" data-act="del" data-index="${i}">🗑</button>
        </div>`;
      cartItemsEl.appendChild(li);
    });
  };

  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".qty-btn");
    if (!btn) return;
    const i = +btn.dataset.index;
    const act = btn.dataset.act;
    if (act === "inc") cartData[i].qty += 1;
    else if (act === "dec") {
      cartData[i].qty -= 1;
      if (cartData[i].qty <= 0) cartData.splice(i, 1);
    } else cartData.splice(i, 1);
    save();
    renderCart();
  });

  const openCart = () => { cart.classList.add("open"); cartOverlay.classList.add("open"); };
  const closeCart = () => { cart.classList.remove("open"); cartOverlay.classList.remove("open"); };

  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  checkoutBtn.addEventListener("click", () => {
    if (!cartData.length) return;
    const total = cartData.reduce((s, it) => s + it.price * it.qty, 0);
    checkoutMsg.textContent = "Pedido simulado realizado por " + formatMoney(total) + " ✓ Gracias por tu compra.";
    cartData = [];
    save();
    renderCart();
    setTimeout(closeCart, 1800);
  });

  async function loadProducts() {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        productsStatus.textContent = "No hay productos en la tabla 'productos'.";
        return;
      }

      productGrid.innerHTML = "";
      productsStatus.textContent = "";

      data.forEach((prod) => {
        const article = document.createElement("article");
        article.className = "card reveal";

        const name = prod.name || prod.title || prod.product_name || "Producto 3D";
        const description = prod.description || prod.desc || "";
        const price = prod.price || prod.precio || 0;
        const imageUrl = prod.image_url || prod.image || prod.img_url || prod.photo_url || "";
        const mpUrl = prod.mercadopago_url || prod.mercadopago || prod.mp_url || null;

        const imgHtml = imageUrl
          ? `<img src="${imageUrl}" alt="${name}" loading="lazy">`
          : `<div class="model-preview">🧩</div>`;

        const btnHtml = mpUrl
          ? `<a class="btn btn-small btn-mp" href="${mpUrl}" target="_blank" rel="noopener noreferrer">Comprar</a>`
          : `<button class="btn btn-small add-cart" data-name="${String(name).replace(/"/g, '&quot;')}" data-price="${price}">Añadir</button>`;

        article.innerHTML = `
          <div class="card-img">
            ${imgHtml}
          </div>
          <div class="card-body">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="card-foot">
              <span class="price">${formatMoney(price)}</span>
              ${btnHtml}
            </div>
          </div>
        `;

        productGrid.appendChild(article);
        observer.observe(article);
      });
    } catch (err) {
      console.error("Error cargando productos:", err);
      productsStatus.textContent = "Error al cargar productos. Revisa las políticas RLS de la tabla 'productos'.";
    }
  }

  productGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-cart");
    if (!btn) return;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const existing = cartData.find((it) => it.name === name);
    if (existing) existing.qty += 1;
    else cartData.push({ name, price, qty: 1 });
    save();
    renderCart();
    showToast(name + " añadido al carrito ✓");
  });

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll(".section-head").forEach((el) => { el.classList.add("reveal"); observer.observe(el); });

  load();
  renderCart();
  loadProducts();
})();