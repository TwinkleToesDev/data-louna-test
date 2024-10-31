import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sql from "../../config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds(): Promise<void> {
  const seedFiles = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.ts'))
    .filter(file => file !== 'seedRunner.ts')
    .sort();

  for (const file of seedFiles) {
    const seedModule = await import(`./${file}`);
    try {
      console.log(`Start seed: ${file}`);
      await seedModule.seed(sql);
    } catch (error) {
      console.error(`Seed Error: ${file}`, error);
      throw error;
    }
  }

  await sql.end();
}

runSeeds()
  .then(() => {
    console.log('Seeds have been successfully completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error while performing the seeds:', error);
    process.exit(1);
  });
