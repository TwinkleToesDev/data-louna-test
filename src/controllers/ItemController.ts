import { FastifyReply, FastifyRequest } from 'fastify';
import { ItemService } from '../services/ItemService.js';
import { Item } from '../models/Item.js';

export class ItemController {
    private itemService: ItemService;

    constructor() {
        this.itemService = new ItemService();
    }

    async getItems(request: FastifyRequest, reply: FastifyReply) {
        try {
            const items = await this.itemService.getItems();
            const result = this.processItems(items);
            reply.send(result);
        } catch (error) {
            reply.status(500).send({ message: 'Error fetching items' });
        }
    }

    private processItems(items: Item[]): any[] {
        const itemMap = new Map<string, { tradablePrice: number | null; nonTradablePrice: number | null }>();

        for (const item of items) {
            const key = item.market_hash_name;

            if (!itemMap.has(key)) {
                itemMap.set(key, { tradablePrice: null, nonTradablePrice: null });
            }

            const entry = itemMap.get(key)!;
            const price = item.min_price ?? item.suggested_price;

            if (item.tradable) {
                if (entry.tradablePrice === null || price < entry.tradablePrice!) {
                    entry.tradablePrice = price;
                }
            } else {
                if (entry.nonTradablePrice === null || price < entry.nonTradablePrice!) {
                    entry.nonTradablePrice = price;
                }
            }
        }

        return Array.from(itemMap.entries()).map(([market_hash_name, prices]) => ({
            market_hash_name,
            tradable_min_price: prices.tradablePrice,
            non_tradable_min_price: prices.nonTradablePrice
        }));
    }
}
