import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const authDbName = process.env.AUTH_DB_NAME || "skill-swap";

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

if (!authDbName) {
  throw new Error("Missing AUTH_DB_NAME environment variable");
}

let clientPromise;

if (!globalThis._betterAuthMongoClientPromise) {
  const client = new MongoClient(uri, {
    appName: "TaskHiveAuth",
  });
  globalThis._betterAuthMongoClientPromise = client.connect();
}

clientPromise = globalThis._betterAuthMongoClientPromise;

export async function getAuthDb() {
  const client = await clientPromise;
  return client.db(authDbName);
}
