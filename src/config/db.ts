import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not specified');
}

const sql = postgres(process.env.DATABASE_URL, {
  debug: process.env.NODE_ENV === 'development',
  max: 10,
});

export default sql;
