self.addEventListener('push', event=>{
    var payload = event.data ? event.data.text() : 'error';
    event.waitUntil(
        self.registration.showNotification('Web Chat', {
            body: payload
        })
    );
});