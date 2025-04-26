document.addEventListener('DOMContentLoaded', () => {
  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const pagina = document.body.dataset.page;
      const esCajas = pagina === 'cajas';
      const esCartas = pagina === 'cartas';
      const esTodo = pagina === 'todo'; // ✅ añadimos esta línea
      const contenedor = document.getElementById(
        esCajas ? 'productos-cajas' :
        esCartas ? 'productos-cartas' :
        'productos-todo'
      );

      const filtroNombre = document.getElementById('filtro-nombre');
      const filtroCategoria = document.getElementById('filtro-categoria');
      const filtroPrecio = document.getElementById('filtro-precio');
      const precioValor = document.getElementById('precio-valor');
      const filtroIdioma = document.getElementById('filtro-idioma');

      // 🔥 Guardamos TODOS los productos iniciales
      const productosOriginales = data.filter(p =>
        (esCajas && p.tipo === 'caja') ||
        (esCartas && p.tipo === 'carta') ||
        (esTodo) // ✅ si es "todo", no filtramos por tipo
      );

      // 🔥 Detectar si hay categoría en la URL
      const params = new URLSearchParams(window.location.search);
      const categoriaInicial = params.get('categoria')?.toLowerCase();

      // 🔥 Mostrar productos iniciales filtrados SOLO si llega una categoría
      let productosMostrados = [...productosOriginales];
      if (categoriaInicial) {
        productosMostrados = productosOriginales.filter(p => p.categoria.toLowerCase().replace(/ /g, "-") === categoriaInicial);
      }

      const render = (lista) => {
        contenedor.innerHTML = lista.map(p => `
          <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" onclick="abrirImagenGrande('${p.imagen}')" style="cursor:zoom-in;">
            <h3>${p.nombre}</h3>
            <p>Categoría: ${p.categoria}</p>
            <p>Idioma: ${p.idioma}</p>
            <p>Precio: ${p.precio}€</p>
            <p>Stock: ${p.stock}</p>
          </div>
        `).join('');
      };

      const aplicarFiltros = () => {
        let filtrados = [...productosOriginales];
        const q = filtroNombre?.value.toLowerCase() || "";
        const cat = filtroCategoria?.value.toLowerCase() || "";
        const idioma = filtroIdioma?.value.toLowerCase() || "";
        const max = parseFloat(filtroPrecio?.value) || 1000;

        if (q) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(q));
        if (cat) filtrados = filtrados.filter(p => p.categoria.toLowerCase().includes(cat));
        if (idioma) filtrados = filtrados.filter(p => (p.idioma || "").toLowerCase().includes(idioma));
        filtrados = filtrados.filter(p => parseFloat(p.precio) <= max);

        render(filtrados);
      };

      render(productosMostrados);

      filtroNombre?.addEventListener('input', aplicarFiltros);
      filtroCategoria?.addEventListener('change', aplicarFiltros);
      filtroIdioma?.addEventListener('change', aplicarFiltros);
      filtroPrecio?.addEventListener('input', () => {
        precioValor.textContent = filtroPrecio.value;
        aplicarFiltros();
      });
    });
});

function abrirImagenGrande(src) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";
  overlay.innerHTML = `<img src="${src}" style="max-width:90vw; max-height:90vh; border-radius:10px;">`;
  overlay.addEventListener("click", () => document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}
