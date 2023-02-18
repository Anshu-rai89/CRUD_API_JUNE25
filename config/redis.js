const redis = require('redis');
const client = redis.createClient();

async function configureData () {
    await client.connect();
    client.del("user-posts");
}

configureData();


module.exports = client;