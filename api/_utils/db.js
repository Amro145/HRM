const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI or MONGO environment variable inside .env');
  }

  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db('hrmanagement');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };
