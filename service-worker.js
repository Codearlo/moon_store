// service-worker.js
// Service Worker para gestionar la caché y actualizaciones

// Nombre de la caché - cambiar versión cuando se actualice el sitio
const CACHE_NAME = 'moon-store-cache-v3.5';

// Recursos para pre-cachear
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/pages/productos.html',
  '/assets/css/base.css',
  '/assets/css/components.css',
  '/assets/css/layout.css',
  '/assets/css/animations.css',
  '/assets/css/responsive.css',
  '/assets/css/mobile-fixes.css',
  '/assets/css/cache-control.css',
  '/assets/js/main.js',
  '/assets/js/components.js',
  '/assets/js/effects.js',
  '/assets/js/navigation.js',
  '/assets/js/mobile-fixes.js',
  '/assets/js/cache-control.js',
  '/assets/js/functions.js',
  '/assets/js/header-fix.js'
];

// Lista de recursos críticos que siempre deben recargarse desde la red
const CRITICAL_RESOURCES = [
  '/assets/img/svg/cart.svg',
  '/assets/img/svg/whatsapp.svg',
  '/assets/img/svg/facebook.svg',
  '/assets/img/svg/instagram.svg',
  '/assets/img/svg/youtube.svg',
  '/assets/img/svg/tiktok.svg',
  '/assets/img/logo.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  // Forzar que se active inmediatamente sin esperar a que el anterior se cierre
  self.skipWaiting();
  
  // Pre-cachear recursos esenciales
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-cacheando archivos');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Pre-caché completado');
      })
      .catch(error => {
        console.error('[Service Worker] Error en pre-caché:', error);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  
  // Limpiar cachés antiguas
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('[Service Worker] Eliminando caché antigua:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[Service Worker] Reclamando control de clientes');
      return self.clients.claim();
    })
  );
});

// Estrategia de caché personalizada para diferentes tipos de recursos
self.addEventListener('fetch', event => {
  // Omitir solicitudes no GET
  if (event.request.method !== 'GET') return;
  
  // Omitir solicitudes a otros dominios
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  
  // Obtener la ruta relativa
  const path = url.pathname;
  
  // Comprobar si es un recurso crítico (SVG, logos, etc.)
  const isCriticalResource = CRITICAL_RESOURCES.some(resource => path.includes(resource)) || 
                              path.includes('.svg') || 
                              path.includes('logo');
  
  // Comprobar si es un recurso que cambia frecuentemente (CSS, JS)
  const isFrequentlyChangedResource = path.match(/\.(css|js)(\?|$)/);
  
  // Para recursos críticos: Network Only, sin caché
  if (isCriticalResource) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  // Para recursos que cambian frecuentemente: Network First, luego cache
  else if (isFrequentlyChangedResource) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Guardar una copia en la caché
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          
          return response;
        })
        .catch(() => {
          // Si la red falla, intentar desde la caché
          return caches.match(event.request);
        })
    );
  } 
  // Para otros recursos: Cache First, luego network (con actualización en segundo plano)
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Iniciar la actualización en segundo plano
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Actualizar la caché con la nueva respuesta
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              
              return networkResponse;
            });
          
          // Devolver la respuesta cacheada si existe, o esperar por la de red
          return cachedResponse || fetchPromise;
        })
    );
  }
});

// Escuchar mensajes desde la página
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.action === 'checkForUpdates') {
    // Notificar a todos los clientes que hay actualizaciones
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'updates-available',
          hasUpdates: true,
          timestamp: Date.now()
        });
      });
    });
  }
  
  if (event.data && event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[Service Worker] Caché eliminada por solicitud del usuario');
        
        // Notificar a los clientes
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'cache-cleared',
              timestamp: Date.now()
            });
          });
        });
      })
    );
  }
});

// Gestionar notificaciones push
self.addEventListener('push', event => {
  console.log('[Service Worker] Push recibido');
  
  const title = 'Moon Store';
  const options = {
    body: event.data ? event.data.text() : 'Nuevas actualizaciones disponibles',
    icon: '/assets/img/logo.png',
    badge: '/assets/img/badge-icon.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Gestionar clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Clic en notificación', event.notification.tag);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});