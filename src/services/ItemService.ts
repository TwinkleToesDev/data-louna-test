import { Item } from '../models/Item.js';
import { ItemRepository } from '../repositories/ItemRepository.js';
import { ApiClient } from '../utils/ApiClient.js';
import { RedisService } from './RedisService.js';

export class ItemService {
    private itemRepository: ItemRepository;
    private redisService: RedisService;
    private apiClient: ApiClient;

    constructor() {
        this.itemRepository = new ItemRepository();
        this.redisService = RedisService.getInstance();
        this.apiClient = new ApiClient('https://api.skinport.com/v1');
    }

    async fetchAndCacheItems(): Promise<void> {
        try {
            const [tradableItems, nonTradableItems] = await Promise.all([
                this.fetchItems(true),
                this.fetchItems(false),
            ]);

            const allItems = [...tradableItems, ...nonTradableItems];
            const uniqueItemsMap = new Map<string, Item>();

            for (const item of allItems) {
                uniqueItemsMap.set(item.market_hash_name + '_' + item.tradable, item);
            }

            const uniqueItems = Array.from(uniqueItemsMap.values());

            await this.redisService.set('items', JSON.stringify(uniqueItems));

            await this.itemRepository.upsertItems(uniqueItems);
        } catch (error) {
            console.error('Error fetching and caching items:', error);
        }
    }

    private async fetchItems(tradable: boolean): Promise<Item[]> {
        const data = await this.apiClient.get<Item[]>('/items', {
            app_id: 730,
            currency: 'EUR',
            tradable: tradable ? 1 : 0,
        });

        return data.map((item) => ({ ...item, tradable }));
    }

    async getItems(): Promise<Item[]> {
        const cachedItems = await this.redisService.get('items');
        if (cachedItems) {
            return JSON.parse(cachedItems);
        } else {
            const items = await this.itemRepository.getAllItems();
            await this.redisService.set('items', JSON.stringify(items));
            return items;
        }
    }
}
