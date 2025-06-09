// assets/js/productos.js
// Script completo para la página de productos

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
        loadUrlParams(); // Cargar parámetros de URL primero
        await cargarProductos();
        
        // Event listeners
        document.getElementById('aplicar-filtros').addEventListener('click', aplicarFiltros);
        document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
        ordenarSelect.addEventListener('change', aplicarFiltros);
        btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
        btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
        
        // Escuchar evento personalizado de búsqueda desde el header
        window.addEventListener('searchUpdated', (e) => {
            buscarInput.value = e.detail.query;
            paginaActual = 1;
            cargarProductos();
        });
        
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
    
    // Función para cargar parámetros de la URL
    function loadUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Cargar parámetros en los filtros
        if (urlParams.get('categoria')) {
            categoriaSelect.value = urlParams.get('categoria');
        }
        if (urlParams.get('buscar')) {
            buscarInput.value = urlParams.get('buscar');
        }
        if (urlParams.get('precio_min')) {
            precioMinInput.value = urlParams.get('precio_min');
        }
        if (urlParams.get('precio_max')) {
            precioMaxInput.value = urlParams.get('precio_max');
        }
        if (urlParams.get('ordenar')) {
            ordenarSelect.value = urlParams.get('ordenar');
        }
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
            // Cargar categorías por defecto si falla la API
            cargarCategoriasDefecto();
        }
    }
    
    function cargarCategoriasDefecto() {
        const categoriasDefecto = [
            { id: 'gaming', nombre: 'PC Gaming' },
            { id: 'workstation', nombre: 'Workstations' },
            { id: 'accesorios', nombre: 'Accesorios' },
            { id: 'componentes', nombre: 'Componentes' },
            { id: 'monitor', nombre: 'Monitores' },
            { id: 'pc-completas', nombre: 'PC Completas' }
        ];
        
        categoriaSelect.innerHTML = '<option value="">Todas las categorías</option>';
        categoriasDefecto.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categoriaSelect.appendChild(option);
        });
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
            // Mostrar productos de ejemplo si falla la API
            mostrarProductosEjemplo();
        }
    }
    
    function mostrarProductosEjemplo() {
        const productosEjemplo = [
            {
                id: 1,
                nombre: 'PC Gaming RTX 4080',
                descripcion: 'Equipo gaming de alto rendimiento con RTX 4080, Intel i7-13700K y 32GB RAM',
                precio: 8500,
                stock: 5,
                categoria: 'PC Gaming',
                imagen: null
            },
            {
                id: 2,
                nombre: 'Monitor Gaming 27" 144Hz',
                descripcion: 'Monitor gaming con panel IPS, 144Hz y G-Sync compatible',
                precio: 1200,
                stock: 8,
                categoria: 'Monitor',
                imagen: null
            },
            {
                id: 3,
                nombre: 'Teclado Mecánico RGB',
                descripcion: 'Teclado mecánico con switches Cherry MX e iluminación RGB',
                precio: 350,
                stock: 12,
                categoria: 'Accesorios',
                imagen: null
            },
            {
                id: 4,
                nombre: 'Tarjeta Gráfica RTX 4070',
                descripcion: 'NVIDIA GeForce RTX 4070 con 12GB GDDR6X',
                precio: 2800,
                stock: 3,
                categoria: 'Componentes',
                imagen: null
            }
        ];
        
        // Filtrar productos según los criterios actuales
        let productosFiltrados = [...productosEjemplo];
        
        // Filtrar por búsqueda
        if (buscarInput.value) {
            const busqueda = buscarInput.value.toLowerCase();
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(busqueda) ||
                p.descripcion.toLowerCase().includes(busqueda)
            );
        }
        
        // Filtrar por categoría
        if (categoriaSelect.value) {
            const categoriaSeleccionada = categoriaSelect.value.toLowerCase();
            productosFiltrados = productosFiltrados.filter(p => 
                p.categoria.toLowerCase().includes(categoriaSeleccionada)
            );
        }
        
        // Filtrar por precio
        if (precioMinInput.value) {
            productosFiltrados = productosFiltrados.filter(p => p.precio >= parseFloat(precioMinInput.value));
        }
        if (precioMaxInput.value) {
            productosFiltrados = productosFiltrados.filter(p => p.precio <= parseFloat(precioMaxInput.value));
        }
        
        mostrarProductos(productosFiltrados);
        actualizarResultados(productosFiltrados.length);
        
        // Simular paginación
        const dataPaginacion = {
            pagina_actual: 1,
            total_paginas: 1,
            total: productosFiltrados.length
        };
        actualizarPaginacion(dataPaginacion);
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
        
        // Actualizar URL con los filtros actuales
        updateUrlParams();
    }
    
    function limpiarFiltros() {
        categoriaSelect.value = '';
        precioMinInput.value = '';
        precioMaxInput.value = '';
        buscarInput.value = '';
        ordenarSelect.value = 'nombre';
        paginaActual = 1;
        
        // Limpiar URL
        window.history.pushState({}, '', window.location.pathname);
        
        cargarProductos();
    }
    
    function updateUrlParams() {
        const params = new URLSearchParams();
        
        if (categoriaSelect.value) params.set('categoria', categoriaSelect.value);
        if (precioMinInput.value) params.set('precio_min', precioMinInput.value);
        if (precioMaxInput.value) params.set('precio_max', precioMaxInput.value);
        if (buscarInput.value) params.set('buscar', buscarInput.value);
        if (ordenarSelect.value !== 'nombre') params.set('ordenar', ordenarSelect.value);
        
        const newUrl = params.toString() ? 
            `${window.location.pathname}?${params}` : 
            window.location.pathname;
            
        window.history.pushState({}, '', newUrl);
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
        totalPaginas = data.total_paginas || 1;
        paginaActualSpan.textContent = data.pagina_actual || 1;
        totalPaginasSpan.textContent = totalPaginas;
        
        btnAnterior.disabled = (data.pagina_actual || 1) <= 1;
        btnSiguiente.disabled = (data.pagina_actual || 1) >= totalPaginas;
        
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
        // Por ahora mostrar un modal simple, después implementar página de detalle
        const productoModal = `
            <div class="producto-modal" onclick="this.remove()">
                <div class="modal-content glass-card" onclick="event.stopPropagation()">
                    <h3>Producto ID: ${id}</h3>
                    <p>Funcionalidad de vista detallada pendiente de implementar.</p>
                    <div style="text-align: center; margin-top: 1rem;">
                        <button class="button primary" onclick="this.closest('.producto-modal').remove()">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', productoModal);
    };
});

// Estilos CSS para el modal temporal
const modalStyles = `
<style>
.producto-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    backdrop-filter: blur(5px);
}

.producto-modal .modal-content {
    max-width: 500px;
    width: 90%;
    padding: 2rem;
    text-align: center;
}

.producto-modal .modal-content h3 {
    margin-bottom: 1rem;
    color: var(--primary-light);
}
</style>
`;

// Agregar estilos al head si no existen
if (!document.querySelector('#producto-modal-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'producto-modal-styles';
    styleElement.innerHTML = modalStyles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);
}