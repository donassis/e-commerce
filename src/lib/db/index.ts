import mongoose from "mongoose";

interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const globalWithMongoose = global as unknown as { mongoose?: CachedConnection };

const cached: CachedConnection = globalWithMongoose.mongoose || { conn: null, promise: null };

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
): Promise<mongoose.Connection> => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MongoDB URI is missing");

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI).then((m) => m.connection);
  cached.conn = await cached.promise;

  globalWithMongoose.mongoose = cached;
  return cached.conn;
};

