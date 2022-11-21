import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.POST_DATABASE_URI;

const connection = async () => {
  await mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongodb'));
};

export default connection;
