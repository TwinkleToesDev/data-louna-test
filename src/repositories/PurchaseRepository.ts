import sql from '../config/db.js';
import { Purchase } from '../models/Purchase.js';
import {Sql} from "postgres";


export class PurchaseRepository {
    async create(purchase: Purchase, tx?: Sql): Promise<void> {
        const db = tx || sql;
        await db`
            INSERT INTO purchases (user_id, item_id, price, quantity)
            VALUES (${purchase.user_id}, ${purchase.item_id}, ${purchase.price}, ${purchase.quantity})
        `;
    }
}
