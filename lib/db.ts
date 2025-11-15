import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI!;
  const desiredDb = process.env.MONGODB_DB_NAME || 'eventhall';

  // If not connected, connect to the desired DB
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName: desiredDb });
    return;
  }

  // If connected to a different DB, reconnect to the desired one
  const currentName = (mongoose.connection as any).name;
  if (mongoose.connection.readyState === 1 && currentName !== desiredDb) {
    await mongoose.disconnect();
    await mongoose.connect(uri, { dbName: desiredDb });
    return;
  }

  // If connecting/disconnecting, attempt to ensure target DB
  if (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3) {
    try {
      await mongoose.connect(uri, { dbName: desiredDb });
    } catch (_) {
      // ignore retry errors; subsequent calls will succeed
    }
  }
}

export function getDbName(): string {
  return (mongoose.connection as any).name || process.env.MONGODB_DB_NAME || 'unknown';
}