import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const appDbName = process.env.APP_DB_NAME || process.env.AUTH_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

if (!appDbName) {
  throw new Error("Missing APP_DB_NAME or AUTH_DB_NAME environment variable");
}

let clientPromise;

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

export async function getAppDb() {
  const client = await clientPromise;
  return client.db(appDbName);
}
