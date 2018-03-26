self.addEventListener('push', event => {
    var payload = event.data ? event.data.text() : 'error';
    event.waitUntil(
        self.registration.showNotification('Web Chat', {
            body: payload
        })
    );
    self.clients.matchAll().then(function (clientList) {
        clientList.forEach(function (client) {
            client.postMessage({ message: payload });
        });
    });
});