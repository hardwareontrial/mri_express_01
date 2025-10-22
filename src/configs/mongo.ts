import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

export class MongoDB {
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('[INFO] MongoDB connected');
    } catch (e) {
      console.error(`[ERROR] MongoDB connection error: ${e}`);
      process.exit(1);
    }
  }
}