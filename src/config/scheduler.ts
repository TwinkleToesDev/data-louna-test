import cron from 'node-cron';
import { ItemService } from '../services/ItemService.js';

export function startScheduler() {
    console.log('Scheduler started')
    const itemService = new ItemService();

    // Fetch and cache items every 6 minutes
    cron.schedule('*/6 * * * *', async () => {
        console.log('CRON: Fetching and caching items...');
        await itemService.fetchAndCacheItems();
    });
}
