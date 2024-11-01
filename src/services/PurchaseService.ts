import { UserRepository } from '../repositories/UserRepository.js';
import { ItemRepository } from '../repositories/ItemRepository.js';
import { PurchaseRepository } from '../repositories/PurchaseRepository.js';
import { Purchase } from '../models/Purchase.js';
import Decimal from 'decimal.js';
import sql from '../config/db.js';

export class PurchaseService {
    private userRepository: UserRepository;
    private itemRepository: ItemRepository;
    private purchaseRepository: PurchaseRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.itemRepository = new ItemRepository();
        this.purchaseRepository = new PurchaseRepository();
    }

    async purchaseItem(userId: number, itemId: number, quantity: number): Promise<void> {
        return await sql.begin(async (tx) => {
            const user = await this.userRepository.findById(userId, tx, true);
            if (!user) {
                throw new Error('User not found');
            }

            const item = await this.itemRepository.getById(itemId, tx, true);
            if (!item) {
                throw new Error('Item not found');
            }

            if (item.quantity < quantity) {
                throw new Error('Insufficient item quantity');
            }

            const totalPrice = new Decimal(item.suggested_price).mul(quantity).toNumber();

            if (user.balance < totalPrice) {
                throw new Error('Insufficient balance');
            }

            const newBalance = await this.userRepository.updateBalance(userId, totalPrice, tx);

            await this.itemRepository.updateQuantity(itemId, quantity, tx);

            const purchase: Purchase = {
                user_id: userId,
                item_id: itemId,
                price: totalPrice,
                quantity,
            };
            await this.purchaseRepository.create(purchase, tx);

            return newBalance;
        });
    }
}
