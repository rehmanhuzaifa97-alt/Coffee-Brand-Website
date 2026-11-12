// ==========================================
// BREW NOIR — COFFEE BEYOND ORDINARY
// Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. PRELOADER
  const preloader = document.querySelector(".preloader");

  window.addEventListener("load", () => {
    if (preloader) {
      preloader.classList.add("hide");
    }
  });

  // 2. MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });
  }

  // 3. NAVBAR SCROLL EFFECT
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  });

  // 4. SMOOTH SCROLLING
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // 5. SCROLL REVEAL ANIMATION
  const revealElements = document.querySelectorAll(
    ".reveal, .collection-card, .dimension-card, .story-content"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // 6. CART DRAWER
  const bag = {};
  const cartCount = document.querySelector("#cartCount");
  const scrim = document.createElement("div");
  scrim.className = "cart-scrim";
  const drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.setAttribute("aria-label", "Shopping cart");
  drawer.innerHTML = `
    <div class="cart-head"><h3>Your Cart</h3><button class="cart-close" aria-label="Close cart">✕</button></div>
    <div class="cart-list"></div>
    <div class="cart-foot">
      <div class="cart-total"><span>TOTAL</span><strong>Rs. 0</strong></div>
      <button class="primary-button cart-checkout">CHECKOUT ↗</button>
    </div>`;
  document.body.append(scrim, drawer);
  const list = drawer.querySelector(".cart-list");
  const fmt = n => "Rs. " + n.toLocaleString("en-US");

  function renderCart() {
    const names = Object.keys(bag);
    let qty = 0, total = 0;
    list.innerHTML = names.length ? names.map(n => {
      qty += bag[n].qty; total += bag[n].qty * bag[n].price;
      return `<div class="cart-item"><div><h4>${n}</h4><span>${fmt(bag[n].price)}</span></div>
        <div class="cart-qty"><button data-act="minus" data-n="${n}" aria-label="Less">−</button><b>${bag[n].qty}</b><button data-act="plus" data-n="${n}" aria-label="More">+</button></div></div>`;
    }).join("") : '<p class="cart-empty">Your cart is empty.<br>Add a blend from the collection.</p>';
    drawer.querySelector(".cart-total strong").textContent = fmt(total);
    if (cartCount) cartCount.textContent = qty;
  }
  const openCart = o => { drawer.classList.toggle("open", o); scrim.classList.toggle("open", o); };
  document.querySelector("#bagButton")?.addEventListener("click", () => openCart(true));
  scrim.addEventListener("click", () => openCart(false));
  drawer.querySelector(".cart-close").addEventListener("click", () => openCart(false));
  document.addEventListener("keydown", e => e.key === "Escape" && openCart(false));
  list.addEventListener("click", e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const it = bag[b.dataset.n];
    it.qty += b.dataset.act === "plus" ? 1 : -1;
    if (it.qty <= 0) delete bag[b.dataset.n];
    renderCart();
  });
  drawer.querySelector(".cart-checkout").addEventListener("click", () => {
    if (!Object.keys(bag).length) return showToast("Your cart is empty");
    Object.keys(bag).forEach(k => delete bag[k]); renderCart(); openCart(false);
    showToast("Thank you! This is a demo checkout.");
  });
  document.querySelectorAll(".add-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.product;
      const price = parseInt(btn.closest(".product-card, .addon-card").querySelector("strong").textContent.replace(/\D/g, ""), 10);
      bag[name] = bag[name] || { price, qty: 0 };
      bag[name].qty++;
      renderCart();
      showToast(`${name} added to your cart`);
    });
  });
  renderCart();

  // 7. COFFEE MATCHER
  const picks = {
    bold:   "Eclipse Blend: dark chocolate, caramel, bold.",
    smooth: "Sunrise Blend: honey and citrus, silky and bright.",
    fruity: "Sunrise Blend: floral, citrus and juicy.",
    deep:   "Midnight Blend: hazelnut, cocoa, intense."
  };
  Object.assign(picks, {
    spiced: "Cardamom Gold: honey, cardamom and warm spice.",
    sweet:  "Hazelnut Dream: vanilla, hazelnut and a buttery finish."
  });
  let mood = null;
  const moods = document.querySelectorAll(".mood-button");

  moods.forEach(b => b.addEventListener("click", () => {
    mood = b.dataset.mood;
    moods.forEach(x => x.classList.toggle("active", x === b));
  }));

  document.querySelector("#matchButton")?.addEventListener("click", () => {
    const box = document.querySelector("#recommendation");
    if (box) box.textContent = mood ? picks[mood] : "Pick a mood first.";
  });

  // 7b. NEWSLETTER FORM
  const newsletterForm = document.querySelector("#newsletterForm");

  newsletterForm?.addEventListener("submit", event => {
    event.preventDefault();
    showToast("Welcome to the Brew Noir circle!");
    newsletterForm.reset();
  });

  // 8. TOAST NOTIFICATION
  function showToast(message) {
    let toast = document.querySelector("#toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // 9. CURRENT YEAR IN FOOTER
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // 10. SCROLL PROGRESS BAR
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.append(bar);

  // 11. PARALLAX (scroll + mouse)
  const heroEl = document.querySelector(".hero");
  const heroBg = document.querySelector(".hero-background");
  const heroContent = document.querySelector(".hero-content");
  const orbitEl = document.querySelector(".hero-visual");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY, h = document.documentElement;
    bar.style.transform = `scaleX(${y / (h.scrollHeight - innerHeight || 1)})`;
    if (y < innerHeight * 1.2) {
      if (heroBg) heroBg.style.translate = `0 ${y * 0.22}px`;
      if (heroContent) heroContent.style.translate = `0 ${y * -0.1}px`;
    }
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  heroEl?.addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    if (orbitEl) orbitEl.style.translate = `${x * -28}px ${y * -28}px`;
  });

  // 12. ACTIVE NAV LINK
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navAnchors.forEach(a => {
    const s = document.querySelector(a.getAttribute("href"));
    if (s) secObs.observe(s);
  });

  // 13. CUSTOM CURSOR (desktop only)
  if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; ring.classList.add("on"); });
    document.addEventListener("mouseleave", () => ring.classList.remove("on"));
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", e => {
      ring.classList.toggle("hover", !!e.target.closest("a, button, .product-card, .dimension-card, input"));
    });
  }

  // 14. MAGNETIC BUTTONS
  if (matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".primary-button, .outline-button, .bag-button").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
      });
      el.addEventListener("mouseleave", () => { el.style.translate = ""; });
    });
  }


  // 15. HERO HEADLINE WORD REVEAL
  const h1 = document.querySelector(".hero-content h1");
  if (h1) {
    let n = 0;
    const wrap = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(t => {
            if (!t.trim()) { frag.append(" "); return; }
            const o = document.createElement("span"), i = document.createElement("span");
            o.className = "w"; i.textContent = t; i.style.setProperty("--i", n++);
            o.append(i); frag.append(o);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) wrap(ch);
      });
    };
    wrap(h1);
  }

  // 16. PRODUCT QUICK VIEW
  const profiles = {
    "Eclipse Blend":  { origin: "Sumatra & Brazil",    roast: "Dark roast",   bars: { Intensity: 90, Body: 85, Sweetness: 55, Acidity: 25 } },
    "Sunrise Blend":  { origin: "Ethiopia & Kenya",    roast: "Light roast",  bars: { Intensity: 45, Body: 50, Sweetness: 70, Acidity: 90 } },
    "Midnight Blend": { origin: "Colombia & Guatemala", roast: "Dark roast",  bars: { Intensity: 80, Body: 90, Sweetness: 60, Acidity: 35 } }
  };
  Object.assign(profiles, {
    "Cardamom Gold":  { origin: "Brazil & India",    roast: "Medium roast", bars: { Intensity: 60, Body: 65, Sweetness: 75, Acidity: 40 } },
    "Hazelnut Dream": { origin: "Brazil & Peru",     roast: "Medium roast", bars: { Intensity: 55, Body: 70, Sweetness: 85, Acidity: 30 } },
    "Rose Pistachio": { origin: "Ethiopia Yirgacheffe", roast: "Light roast", bars: { Intensity: 40, Body: 45, Sweetness: 80, Acidity: 70 } },
    "Saffron Silk":     { origin: "Brazil & Kashmir",    roast: "Medium roast", bars: { Intensity: 50, Body: 70, Sweetness: 80, Acidity: 35 } },
    "Coconut Cloud":    { origin: "Colombia & Indonesia", roast: "Medium roast", bars: { Intensity: 45, Body: 60, Sweetness: 85, Acidity: 45 } },
    "Maple Pecan":      { origin: "Guatemala & Brazil",   roast: "Medium-dark roast", bars: { Intensity: 70, Body: 75, Sweetness: 75, Acidity: 30 } },
    "Dark Cherry Noir": { origin: "Ethiopia & Sumatra",   roast: "Dark roast",   bars: { Intensity: 75, Body: 70, Sweetness: 55, Acidity: 60 } }
  });
  const qv = document.createElement("div");
  qv.className = "qv";
  qv.innerHTML = `<div class="qv-box" role="dialog" aria-modal="true">
    <button class="qv-close" aria-label="Close">✕</button>
    <div class="qv-img"><img alt=""></div>
    <div class="qv-info">
      <span class="eyebrow"></span><h3></h3><p class="qv-notes"></p>
      <div class="qv-bars"></div>
      <div class="qv-row"><strong></strong><button class="primary-button qv-add">ADD TO CART +</button></div>
    </div></div>`;
  document.body.append(qv);
  let qvCard = null;
  const closeQV = () => qv.classList.remove("open");
  function openQV(card) {
    qvCard = card;
    const name = card.querySelector("h3").textContent;
    const p = profiles[name] || { origin: "Single estate", roast: "Medium roast", bars: { Intensity: 60, Body: 60, Sweetness: 60, Acidity: 60 } };
    qv.querySelector("img").src = card.querySelector("img").src;
    qv.querySelector("img").alt = name;
    qv.querySelector(".eyebrow").textContent = `${p.roast} · ${p.origin}`.toUpperCase();
    qv.querySelector("h3").textContent = name;
    qv.querySelector(".qv-notes").textContent = card.querySelector(".product-info p").textContent;
    qv.querySelector("strong").textContent = card.querySelector(".product-info strong").textContent;
    qv.querySelector(".qv-bars").innerHTML = Object.entries(p.bars).map(([k]) =>
      `<div class="qv-bar"><span>${k}</span><div><i></i></div></div>`).join("");
    qv.classList.add("open");
    setTimeout(() => qv.querySelectorAll(".qv-bar i").forEach((el, i) => el.style.width = Object.values(p.bars)[i] + "%"), 250);
  }
  document.querySelectorAll(".product-card .product-image, .product-card h3").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => openQV(el.closest(".product-card")));
  });
  qv.addEventListener("click", e => { if (e.target === qv) closeQV(); });
  qv.querySelector(".qv-close").addEventListener("click", closeQV);
  qv.querySelector(".qv-add").addEventListener("click", () => { qvCard.querySelector(".add-button").click(); closeQV(); });
  document.addEventListener("keydown", e => e.key === "Escape" && closeQV());


  // 17. 3D COFFEE BEANS (Three.js) + 3D TILT
  const hero3d = document.querySelector(".hero");
  if (window.THREE && hero3d) {
    const canvas = document.createElement("canvas");
    canvas.className = "hero-3d";
    hero3d.append(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 14;

    // --- lighting: warm, natural, no odd blue tint ---
    scene.fog = new THREE.Fog(0x0e0805, 12, 27);
    scene.add(new THREE.AmbientLight(0xffe7c8, 0.35));
    scene.add(new THREE.HemisphereLight(0xffe2bd, 0x2a1608, 0.7));
    const key = new THREE.DirectionalLight(0xffdcae, 1.7); key.position.set(-6, 9, 9); scene.add(key);
    const rim = new THREE.PointLight(0xd9a566, 1.6, 40); rim.position.set(9, -3, 3); scene.add(rim);

    // --- procedural roasted-bean surface (colour + bump) ---
    const TEX = 512;
    const rnd = (a, b) => a + Math.random() * (b - a);
    function wrapDraw(ctx, fn, x, r) { fn(x); if (x - r < 0) fn(x + TEX); if (x + r > TEX) fn(x - TEX); }
    function makeTextures() {
      const col = document.createElement("canvas"), bmp = document.createElement("canvas");
      col.width = col.height = bmp.width = bmp.height = TEX;
      const c = col.getContext("2d"), b = bmp.getContext("2d");
      c.fillStyle = "#4a2917"; c.fillRect(0, 0, TEX, TEX);
      b.fillStyle = "#808080"; b.fillRect(0, 0, TEX, TEX);
      // uneven roast: soft lighter / darker patches
      for (let i = 0; i < 170; i++) {
        const x = rnd(0, TEX), y = rnd(0, TEX), r = rnd(18, 70), light = Math.random() > 0.5;
        const rgb = light ? "120,70,38" : "22,10,5", al = rnd(0.05, 0.16);
        wrapDraw(c, xx => {
          const g = c.createRadialGradient(xx, y, 0, xx, y, r);
          g.addColorStop(0, `rgba(${rgb},${al})`); g.addColorStop(1, `rgba(${rgb},0)`);
          c.fillStyle = g; c.fillRect(xx - r, y - r, r * 2, r * 2);
        }, x, r);
      }
      // fine wrinkles that run along the length of the bean
      for (let i = 0; i < 260; i++) {
        const x0 = rnd(0, TEX), y0 = rnd(0, TEX), len = rnd(30, 130), wob = rnd(1, 5), ph = rnd(0, 6.28);
        const dark = Math.random() > 0.4, w = rnd(0.8, 2.4);
        const draw = (xo) => {
          [[c, dark ? "rgba(15,7,3,0.28)" : "rgba(150,95,55,0.16)"], [b, dark ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.22)"]].forEach(([ctx, st]) => {
            ctx.strokeStyle = st; ctx.lineWidth = w; ctx.beginPath();
            for (let k = 0; k <= 12; k++) {
              const t = k / 12, xx = xo + Math.sin(t * 5 + ph) * wob, yy = y0 + t * len;
              k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
            }
            ctx.stroke();
          });
        };
        wrapDraw(c, draw, x0, 8);
      }
      // grain
      [[c, 16], [b, 34]].forEach(([ctx, amt]) => {
        const img = ctx.getImageData(0, 0, TEX, TEX), d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const n = (Math.random() - 0.5) * amt;
          d[i] += n; d[i + 1] += n; d[i + 2] += n;
        }
        ctx.putImageData(img, 0, 0);
      });
      const mk = cv => {
        const t = new THREE.CanvasTexture(cv);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        return t;
      };
      return { map: mk(col), bump: mk(bmp) };
    }
    const tex = makeTextures();

    // --- real bean shape: oval, flatter face with a curved centre cleft ---
    function makeBeanGeometry() {
      const geo = new THREE.SphereGeometry(1, 72, 54);
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const sstep = (e0, e1, v) => { const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        let X = x * 0.68, Y = y, Z = z * 0.5;
        if (Z > 0) Z *= 0.8;                                   // flatter cleft side, rounder back
        const cx = 0.06 * Math.sin(Y * 3.0);                   // gentle S-curve
        const d = X - cx;
        const endFade = Math.pow(Math.max(0, 1 - Y * Y), 0.45);
        const faceW = sstep(0.05, 0.45, z);                    // only on the flat face
        const groove = Math.exp(-(d * d) / 0.0042) * endFade * faceW;
        const lip = Math.exp(-Math.pow(Math.abs(d) - 0.17, 2) / 0.006) * endFade * faceW;
        Z += -groove * 0.17 + lip * 0.035;
        pos.setXYZ(i, X, Y, Z);
        const shade = 1 - groove * 0.6;                        // cleft sits in shadow
        colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = shade;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      // weld normals along the UV seam and poles so there are no visible lines
      const nrm = geo.attributes.normal, groups = new Map();
      for (let i = 0; i < pos.count; i++) {
        const k = pos.getX(i).toFixed(4) + "," + pos.getY(i).toFixed(4) + "," + pos.getZ(i).toFixed(4);
        (groups.get(k) || groups.set(k, []).get(k)).push(i);
      }
      groups.forEach(ids => {
        if (ids.length < 2) return;
        let nx = 0, ny = 0, nz = 0;
        ids.forEach(i => { nx += nrm.getX(i); ny += nrm.getY(i); nz += nrm.getZ(i); });
        const l = Math.hypot(nx, ny, nz) || 1;
        ids.forEach(i => nrm.setXYZ(i, nx / l, ny / l, nz / l));
      });
      return geo;
    }
    const beanGeo = makeBeanGeometry();

    // a few roast tones so the beans are not all identical
    const mats = [0xffffff, 0xe8cdb2, 0xcfa985, 0xf2dcc6].map(c => new THREE.MeshPhysicalMaterial({
      color: c, map: tex.map, bumpMap: tex.bump, bumpScale: 2.4, vertexColors: true,
      roughness: 0.48, metalness: 0.03, clearcoat: 0.28, clearcoatRoughness: 0.42
    }));

    const beans = new THREE.Group();
    scene.add(beans);
    const items = [];
    for (let i = 0; i < 34; i++) {
      const g = new THREE.Mesh(beanGeo, mats[i % mats.length]);
      const s = 0.3 + Math.random() * 0.34;
      g.scale.set(s * rnd(0.92, 1.08), s * rnd(0.92, 1.1), s * rnd(0.9, 1.1));
      g.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 11, -7 + Math.random() * 9);
      g.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
      beans.add(g);
      items.push({ g, rx: (Math.random() - 0.5) * 0.007, ry: (Math.random() - 0.5) * 0.009, ph: Math.random() * 6, y0: g.position.y });
    }

    function size() {
      const w = hero3d.clientWidth, h = hero3d.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size(); window.addEventListener("resize", size);

    let mx = 0, my = 0, t = 0, still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.addEventListener("mousemove", e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
    function loop() {
      requestAnimationFrame(loop);
      if (window.scrollY > innerHeight * 1.3) return;
      t += 0.01;
      items.forEach(o => {
        if (!still) { o.g.rotation.x += o.rx; o.g.rotation.y += o.ry; }
        o.g.position.y = o.y0 + Math.sin(t + o.ph) * 0.35;
      });
      camera.position.x += (mx * 2.4 - camera.position.x) * 0.05;
      camera.position.y += (-my * 1.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      beans.rotation.y = window.scrollY * 0.0012;
      beans.position.y = window.scrollY * 0.006;
      renderer.render(scene, camera);
    }
    loop();
  }

  // hero photo: 3D tilt
  const hv = document.querySelector(".hero-visual");
  if (hv && matchMedia("(pointer: fine)").matches) {
    hero3d?.addEventListener("mousemove", e => {
      if (innerWidth <= 700) return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      hv.style.transform = `translateY(-46%) perspective(900px) rotateY(${x * -16}deg) rotateX(${y * 12}deg)`;
    });
  }

  // product cards: 3D tilt + glare
  document.querySelectorAll(".product-card").forEach(card => {
    const img = card.querySelector(".product-image");
    if (!img) return;
    card.addEventListener("pointermove", e => {
      const r = img.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      img.style.setProperty("--ry", (x - 0.5) * 16 + "deg");
      img.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
      img.style.setProperty("--gx", x * 100 + "%");
      img.style.setProperty("--gy", y * 100 + "%");
    });
    card.addEventListener("pointerleave", () => { img.style.setProperty("--rx", "0deg"); img.style.setProperty("--ry", "0deg"); });
  });


  // 18. FLAVOUR FILTER
  const chips = document.querySelectorAll("#flavourFilter .chip");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.toggle("active", c === chip));
    const f = chip.dataset.f;
    document.querySelectorAll(".product-card").forEach(card => {
      const show = f === "all" || (card.dataset.tags || "").split(" ").includes(f);
      card.classList.toggle("filtered-out", !show);
      if (show) card.classList.add("visible");
    });
  }));

});