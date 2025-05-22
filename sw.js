const CACHE_NAME = 'meu-pwa-cache-v2'; // Mude 'v1' se atualizar os arquivos cacheados
const urlsToCache = [
  '/', // Sua página inicial
  '/html/presentes.html', // Sua página inicial (se for diferente de /)
  '/style/presentes.css', // Seu arquivo CSS principal
  '/js/presentes.js', // Seu arquivo JS principal
  'images/2640131_192x192.png',
  '/images/2640131.png'
  // Adicione aqui outros arquivos estáticos importantes (imagens, fontes, etc.)
];

// Evento de Instalação: Cacheia os arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Fetch: Intercepta as requisições de rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna do cache
        if (response) {
          return response;
        }
        // Caso contrário, busca na rede
        return fetch(event.request).then(
          networkResponse => {
            // Opcional: Cachear dinamicamente novos recursos
            // if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            //   const responseToCache = networkResponse.clone();
            //   caches.open(CACHE_NAME)
            //     .then(cache => {
            //       cache.put(event.request, responseToCache);
            //     });
            // }
            return networkResponse;
          }
        ).catch(() => {
          // Opcional: Retornar uma página offline padrão se a rede falhar e não estiver em cache
          // if (event.request.mode === 'navigate') { // Apenas para navegação de páginas
          //   return caches.match('/offline.html'); // Você precisaria ter 'offline.html' no urlsToCache
          // }
        });
      })
  );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Apenas o cache atual deve permanecer
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Deleta caches antigos
          }
        })
      );
    })
  );
});