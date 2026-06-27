import { betterAuth } from "better-auth";
import { customSession, jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_DB_URI;
const authDbName = process.env.AUTH_DB_NAME || "skill-swap";

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

const createMongoClient = () => {
  const existingClient = globalThis._betterAuthMongoClient;
  const existingPromise = globalThis._betterAuthMongoClientPromise;

  if (existingClient && typeof existingClient.topology?.isConnected === "function") {
    try {
      if (existingClient.topology.isConnected()) {
        return {
          client: existingClient,
          clientPromise: existingPromise,
        };
      }
    } catch {
      // ignore and recreate below
    }
  }

  const client = new MongoClient(uri, {
    appName: "TaskHiveAuth",
  });
  const clientPromise = client.connect();

  globalThis._betterAuthMongoClient = client;
  globalThis._betterAuthMongoClientPromise = clientPromise;

  clientPromise.catch((error) => {
    console.error("Mongo client connection error:", error);
  });

  return {
    client,
    clientPromise,
  };
};

const { client, clientPromise } = createMongoClient();
const db = client.db(authDbName);

const appUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const trustedOrigins = [
  appUrl,
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Client",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    },
    cookie: {
      name: "taskhive_session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
  },
  trustedOrigins,
  plugins: [
    jwt(),
    customSession(async ({ user, session }) => ({
      user: {
        ...user,
        role: user.role ?? "Client",
      },
      session,
    })),
  ],
  baseURL: appUrl,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
});
