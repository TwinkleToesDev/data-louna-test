import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sql from "../../config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations(): Promise<void> {
  const migrationFiles = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.ts'))
    .filter(file => file !== 'migrationRunner.ts')
    .sort();

  for (const file of migrationFiles) {
    const migrationModule = await import(`./${file}`);
    try {
      console.log(`Running migration: ${file}`);
      await migrationModule.up(sql);
    } catch (error) {
      console.error(`Failed migration: ${file}`, error);
      throw error;
    }
  }

  await sql.end();
}

runMigrations()
    .then(() => {
      console.log('Migration Success');
      process.exit(0);
    })

