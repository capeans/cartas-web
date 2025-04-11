document.addEventListener('DOMContentLoaded', () => {
  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('productos-cajas');
      const filtroNombre = document.getElementById('filtro-nombre');
      const filtroCategoria = document.getElementById('filtro-categoria');
      const filtroIdioma = document.getElementById('filtro-idioma');
      const filtroPrecio = document.getElementById('filtro-precio');
      const precioValor = document.getElementById('precio-valor');

      let productos = data.filter(p => p.tipo === 'caja');

      const render = (lista) => {
        contenedor.innerHTML = lista.map(p => `
          <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" onclick="mostrarImagen('${p.imagen}')">
            <h3>${p.nombre}</h3>
            <p>Categoría: ${p.categoria}</p>
            <p>Idioma: ${p.idioma || 'Desconocido'}</p>
            <p>Precio: ${p.precio}€</p>
            <p>Stock: ${p.stock}</p>
            <div class="modo-compra">
              <label><input type="radio" name="modo-${p.nombre}" value="sellada" checked> Sellada</label>
              <label><input type="radio" name="modo-${p.nombre}" value="directo"> Abrir en directo</label>
            </div>
          </div>
        `).join('');
      };

      const aplicarFiltros = () => {
        let filtrados = productos;
        const q = filtroNombre?.value.toLowerCase() || "";
        const cat = filtroCategoria?.value.toLowerCase() || "";
        const idioma = filtroIdioma?.value.toLowerCase() || "";
        const max = parseFloat(filtroPrecio?.value) || 100;

        if (q) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(q));
        if (cat) filtrados = filtrados.filter(p => p.categoria.toLowerCase().includes(cat));
        if (idioma) filtrados = filtrados.filter(p => (p.idioma || '').toLowerCase().includes(idioma));
        filtrados = filtrados.filter(p => parseFloat(p.precio) <= max);

        render(filtrados);
      };

      render(productos);
      filtroNombre?.addEventListener('input', aplicarFiltros);
      filtroCategoria?.addEventListener('change', aplicarFiltros);
      filtroIdioma?.addEventListener('change', aplicarFiltros);
      filtroPrecio?.addEventListener('input', () => {
        precioValor.textContent = filtroPrecio.value;
        aplicarFiltros();
      });
    });
});

function mostrarImagen(src) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 1000;
  overlay.innerHTML = `<img src="${src}" style="max-width:90vw; max-height:90vh; border-radius:8px;">`;
  overlay.onclick = () => document.body.removeChild(overlay);
  document.body.appendChild(overlay);
}
