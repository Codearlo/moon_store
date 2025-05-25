// assets/js/productos.js
document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    let paginaActual = 1;
    let totalPaginas = 1;
    
    // Elementos DOM
    const categoriaSelect = document.getElementById('categoria');
    const precioMinInput = document.getElementById('precio-min');
    const precioMaxInput = document.getElementById('precio-max');
    const buscarInput = document.getElementById('buscar');
    const ordenarSelect = document.getElementById('ordenar');
    const productosGrid = document.getElementById('productos-grid');
    const totalProductosSpan = document.getElementById('total-productos');
    const paginacionDiv = document.getElementById('paginacion');
    const paginaActualSpan = document.getElementById('pagina-actual');
    const totalPaginasSpan = document.getElementById('total-paginas');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    
    // Inicializar
    init();
    
    async function init() {
        await cargarCategorias();
        await cargarProductos();
        
        // Event listeners
        document.getElementById('aplicar-filtros').addEventListener('click', aplicarFiltros);
        document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
        ordenarSelect.addEventListener('change', aplicarFiltros);
        btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
        btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
        
        // Buscar en tiempo real
        let timeoutBuscar;
        buscarInput.addEventListener('input', () => {
            clearTimeout(timeoutBuscar);
            timeoutBuscar = setTimeout(() => {
                paginaActual = 1;
                cargarProductos();
            }, 500);
        });
    }
    
    async function cargarCategorias() {
        try {
            const response = await fetch('../backend/categorias.php');
            const data = await response.json();
            
            if (data.success) {
                categoriaSelect.innerHTML = '<option value="">Todas las categorías</option>';
                data.categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    categoriaSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    }
    
    async function cargarProductos() {
        mostrarLoading();
        
        try {
            const params = new URLSearchParams({
                categoria: categoriaSelect.value,
                precio_min: precioMinInput.value,
                precio_max: precioMaxInput.value,
                buscar: buscarInput.value,
                ordenar: ordenarSelect.value,
                pagina: paginaActual
            });
            
            const response = await fetch(`../backend/productos.php?${params}`);
            const data = await response.json();
            
            if (data.success) {
                mostrarProductos(data.productos);
                actualizarPaginacion(data);
                actualizarResultados(data.total);
            } else {
                mostrarError('Error al cargar productos');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error de conexión');
        }
    }
    
    function mostrarLoading() {
        productosGrid.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Cargando productos...</p>
            </div>
        `;
    }
    
    function mostrarProductos(productos) {
        if (productos.length === 0) {
            productosGrid.innerHTML = `
                <div class="no-productos">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta cambiar los filtros de búsqueda</p>
                </div>
            `;
            return;
        }
        
        productosGrid.innerHTML = productos.map(producto => crearProductoCard(producto)).join('');
    }
    
    function crearProductoCard(producto) {
        const stockClase = producto.stock > 0 ? 'disponible' : 'agotado';
        const stockTexto = producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado';
        const imagenSrc = producto.imagen || '';
        
        return `
            <div class="producto-card glass-card animate-fade-in-up">
                <div class="producto-imagen">
                    ${imagenSrc ? 
                        `<img src="${imagenSrc}" alt="${producto.nombre}" loading="lazy">` :
                        `<div class="placeholder">📦</div>`
                    }
                </div>
                <div class="producto-info">
                    <div class="producto-categoria">${producto.categoria || 'Sin categoría'}</div>
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="producto-precio">
                        <span class="currency">S/</span> ${formatearPrecio(producto.precio)}
                    </div>
                    <div class="producto-stock ${stockClase}">
                        ${stockTexto}
                    </div>
                    <div class="producto-acciones">
                        <button class="btn-ver-producto" 
                                ${producto.stock === 0 ? 'disabled' : ''}
                                onclick="verProducto(${producto.id})">
                            ${producto.stock > 0 ? 'Ver producto' : 'Agotado'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function mostrarError(mensaje) {
        productosGrid.innerHTML = `
            <div class="no-productos">
                <h3>Error</h3>
                <p>${mensaje}</p>
                <button class="button primary" onclick="location.reload()">
                    Recargar página
                </button>
            </div>
        `;
    }
    
    function aplicarFiltros() {
        paginaActual = 1;
        cargarProductos();
    }
    
    function limpiarFiltros() {
        categoriaSelect.value = '';
        precioMinInput.value = '';
        precioMaxInput.value = '';
        buscarInput.value = '';
        ordenarSelect.value = 'nombre';
        paginaActual = 1;
        cargarProductos();
    }
    
    function cambiarPagina(nuevaPagina) {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            cargarProductos();
            
            // Scroll suave al inicio de productos
            document.querySelector('.productos-section').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    function actualizarPaginacion(data) {
        totalPaginas = data.total_paginas;
        paginaActualSpan.textContent = data.pagina_actual;
        totalPaginasSpan.textContent = totalPaginas;
        
        btnAnterior.disabled = data.pagina_actual <= 1;
        btnSiguiente.disabled = data.pagina_actual >= totalPaginas;
        
        paginacionDiv.style.display = totalPaginas > 1 ? 'flex' : 'none';
    }
    
    function actualizarResultados(total) {
        const texto = total === 1 ? 
            '1 producto encontrado' : 
            `${total} productos encontrados`;
        totalProductosSpan.textContent = texto;
    }
    
    function formatearPrecio(precio) {
        return precio.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Función global para ver producto (temporal)
    window.verProducto = function(id) {
        alert(`Ver producto ID: ${id}\n(Funcionalidad pendiente)`);
    };
});