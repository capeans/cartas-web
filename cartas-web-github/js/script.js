document.addEventListener('DOMContentLoaded', () => {
  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const pagina = document.body.dataset.page;
      const esCajas = pagina === 'cajas';
      const esCartas = pagina === 'cartas';
      const contenedor = document.getElementById(esCajas ? 'productos-cajas' : 'productos-cartas');
      const filtro = document.getElementById('buscador');

      const render = (productos) => {
        contenedor.innerHTML = productos.map(p => `
          <div class="producto" onclick="window.open('${p.enlace}', '_blank')">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>Categoría: ${p.categoria}</p>
            <p>Precio: ${p.precio}€</p>
            <p>Stock: ${p.stock}</p>
          </div>
        `).join('');
      };

      let productos = data.filter(p => (esCajas && p.tipo === 'caja') || (esCartas && p.tipo === 'carta'));
      render(productos);

      if (filtro) {
        filtro.addEventListener('input', e => {
          const q = e.target.value.toLowerCase();
          const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
          render(filtrados);
        });
      }
    });
});
