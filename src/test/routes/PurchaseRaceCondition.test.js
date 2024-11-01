import {test} from 'tap';

const NUM_REQUESTS = 10;
const purchaseRequests = [];

test('Concurrent purchase requests', async (t) => {
    for (let i = 0; i < NUM_REQUESTS; i++) {
        purchaseRequests.push(
            fetch('http://127.0.0.1:3000/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'sessionId=l7xhlvmdd98' // Замените на действительный session ID
                },
                body: JSON.stringify({ itemId: 1, quantity: 1 })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => Promise.reject({ status: response.status, data }));
                    }
                    return response.json();
                })
                .then(data => ({ status: 'fulfilled', value: data }))
                .catch(error => ({ status: 'rejected', reason: error }))
        );
    }

    const results = await Promise.all(purchaseRequests);

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            t.ok(result.value, `Request ${index + 1} succeeded`);
        } else {
            t.fail(`Request ${index + 1} failed: ${JSON.stringify(result.reason.data)}`);
        }
    });

    t.end();
});
