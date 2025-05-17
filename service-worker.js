// service-worker.js
// Service Worker para gestionar la caché y actualizaciones

// Nombre de la caché
const CACHE_NAME = 'moon-store-cache-v1';

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
  '/assets/js/main.js',
  '/assets/js/components.js',
  '/assets/js/effects.js',
  '/assets/js/navigation.js',
  '/assets/js/mobile-fixes.js',
  '/assets/js/cache-control.js'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  // Pre-cachear recursos esenciales
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-cacheando archivos');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Pre-caché completado');
        return self.skipWaiting();
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

// Estrategia de caché: "Network First, fallback to Cache"
self.addEventListener('fetch', event => {
  // Omitir solicitudes no GET
  if (event.request.method !== 'GET') return;
  
  // Omitir solicitudes a otros dominios
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  
  // Detectar solicitudes de recursos que deben ser siempre actualizados (CSS, JS)
  const isCriticalRequest = event.request.url.match(/\.(css|js)(\?|$)/);
  
  if (isCriticalRequest) {
    // Para recursos críticos: Network first, luego cache
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
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si no está en caché, devolver un error
              console.error('[Service Worker] Recurso no encontrado en cache:', event.request.url);
              return new Response('Recurso no disponible sin conexión', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } else {
    // Para otros recursos: Stale-while-revalidate
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Devolver la caché mientras actualizamos en segundo plano
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Actualizar la caché con la nueva respuesta
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, networkResponse.clone()));
              
              return networkResponse;
            })
            .catch(error => {
              console.error('[Service Worker] Error al buscar recurso:', error);
            });
          
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
    // Aquí podríamos implementar lógica para verificar actualizaciones
    // Por simplicidad, simplemente notificamos que hay actualizaciones
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'updates-available',
          hasUpdates: true
        });
      });
    });
  }
});

// Gestionar notificaciones push
self.addEventListener('push', event => {
  console.log('[Service Worker] Push recibido');
  
  const title = 'Moon Store';
  const options = {
    body: event.data.text() || 'Nuevas actualizaciones disponibles',
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