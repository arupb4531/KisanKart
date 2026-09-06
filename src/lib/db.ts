import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisankart';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer?: any;
  hasAutoSeeded?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, hasAutoSeeded: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Quick timeout before fallback
    };

    cached.promise = (async () => {
      let activeConn: typeof mongoose;
      try {
        activeConn = await mongoose.connect(MONGODB_URI, opts);
        console.log('✅ Connected to MongoDB via standard URI:', MONGODB_URI);
      } catch (err: any) {
        console.warn('⚠️ Standard MongoDB connection failed, attempting local in-memory fallback server...', err?.message || err);
        
        try {
          // Dynamic import of mongodb-memory-server to avoid bundling issues
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          if (!cached.memoryServer) {
            cached.memoryServer = await MongoMemoryServer.create({
              instance: { dbName: 'kisankart' },
            });
          }
          const memoryUri = cached.memoryServer.getUri();
          console.log('🌱 Connected to embedded in-memory MongoDB at:', memoryUri);
          activeConn = await mongoose.connect(memoryUri, { bufferCommands: false });
        } catch (memErr: any) {
          console.error('❌ In-memory MongoDB failed to launch:', memErr?.message || memErr);
          throw err;
        }
      }

      // Automatically seed if the database is brand new and empty
      if (!cached.hasAutoSeeded) {
        try {
          const collections = await activeConn.connection.db?.listCollections({ name: 'products' }).toArray();
          const productCount = collections && collections.length > 0 
            ? await activeConn.connection.db?.collection('products').countDocuments()
            : 0;

          if (productCount === 0) {
            console.log('🌱 Empty database detected on startup. Auto-seeding initial products & demo accounts...');
            const { runDatabaseSeed } = await import('@/lib/seedData');
            await runDatabaseSeed();
            cached.hasAutoSeeded = true;
          }
        } catch (seedErr) {
          console.warn('⚠️ Auto-seed check skipped or failed:', seedErr);
        }
      }

      return activeConn;
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
