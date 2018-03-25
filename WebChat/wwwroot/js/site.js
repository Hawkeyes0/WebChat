// Write your JavaScript code.
var endpoint;
var key;
var secret;

navigator.serviceWorker.register('./js/sw.js')
    .then(registration => {
        return registration.pushManager.getSubscription()
            .then(subscription => {
                if (subscription)
                    return subscription;
                return registration.pushManager.subscribe({ userVisibleOnly: true });
            });
    }).then(subscription => {
        endpoint = subscription.endpoint;

        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        key = rawKey ? btoa(String.fromCharCode(new Uint8Array(rawKey))) : '';

        var rawSecret = subscription.getKey ? subscription.getKey('auth') : '';
        secret = rawSecret ? btoa(String.fromCharCode(new Uint8Array(rawSecret))) : '';

        fetch('./push/register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                endpoint: endpoint,
                key: key,
                secret: secret
            })
        });
    });

document.getElementById('send').onclick = (event) => {
    var text = document.getElementById('payload').value;

    fetch('./chat/send', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: endpoint,
            payload: text
        })
    });
};