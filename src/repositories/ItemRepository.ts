import sql from '../config/db.js';
import { Item } from '../models/Item.js';
import postgres, {Sql} from "postgres";

export class ItemRepository {
    async upsertItems(items: Item[]): Promise<void> {
        const queries = items.map((item) =>
        sql`
            INSERT INTO items (
              market_hash_name, currency, suggested_price, item_page,
              market_page, min_price, max_price, mean_price, quantity, tradable
            )
            VALUES (
              ${item.market_hash_name}, ${item.currency}, ${item.suggested_price}, ${item.item_page},
              ${item.market_page}, ${item.min_price}, ${item.max_price}, ${item.mean_price}, ${item.quantity}, ${item.tradable}
            )
            ON CONFLICT (market_hash_name, tradable) DO UPDATE SET
              currency = EXCLUDED.currency,
              suggested_price = EXCLUDED.suggested_price,
              item_page = EXCLUDED.item_page,
              market_page = EXCLUDED.market_page,
              min_price = EXCLUDED.min_price,
              max_price = EXCLUDED.max_price,
              mean_price = EXCLUDED.mean_price,
              quantity = EXCLUDED.quantity;
        `);

        await Promise.all(queries);
    }

    async getById(itemId: number, tx?: Sql, forUpdate: boolean = false): Promise<postgres.Row | null> {
        const db = tx || sql;
        let query = db`SELECT * FROM items WHERE id = ${itemId}`;
        if (forUpdate) {
            query = db`SELECT * FROM items WHERE id = ${itemId} FOR UPDATE`;
        }
        const [item] = await query;
        return item || null;
    }

    async updateQuantity(itemId: number, newQuantity: number, tx?: Sql): Promise<void> {
        const db = tx || sql;
        await db`UPDATE items SET quantity = ${newQuantity} WHERE id = ${itemId}`;
    }

    async getAllItems(): Promise<Item[]> {
        return await sql<Item[]>`SELECT * FROM items`;
    }
}
