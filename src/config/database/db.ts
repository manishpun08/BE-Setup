import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import config from '@utils/config';
import { logger } from '@common/logger';

export async function connect(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.NODE_ENV === 'Test') {
        const mongod = await MongoMemoryReplSet.create({
          replSet: { count: 4 },
        });
        const uri = mongod.getUri();
        config.MONGODB_URI = uri;
        await mongoose.connect(uri);
        mongoose.Promise = global.Promise;
        resolve();
      } else {
        const uri = config.MONGODB_URI;
        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(uri);
        mongoose.Promise = global.Promise;
        logger.info('Connected to database:', mongoose.connection.name);
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function close(): Promise<void> {
  return mongoose.disconnect();
}
