// Write your JavaScript code.
var endpoint;
var key;
var secret;
var raw;

navigator.serviceWorker.register('/sw.js?v=1', { scope: '/' })
    .then(registration => {
        console.debug(registration);
        return registration.pushManager.getSubscription()
            .then(subscription => {
                if (subscription)
                    return subscription;
                return registration.pushManager.subscribe({ userVisibleOnly: true });
            });
    }).then(subscription => {

        console.debug(subscription);

        endpoint = subscription.endpoint;

        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';

        var rawSecret = subscription.getKey ? subscription.getKey('auth') : '';
        secret = rawSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawSecret))) : '';

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
navigator.serviceWorker.onmessage = (event) => {
    console.log(event);
    var div = document.getElementById('history');
    div.innerHTML += event.data.message + '<br/>';
};

document.getElementById('send').onclick = (event) => {
    var text = document.getElementById('payload').value;

    fetch('./chat/send', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: endpoint,
            key: key,
            secret: secret,
            payload: text
        })
    });
};

