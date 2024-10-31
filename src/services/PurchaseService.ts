import { UserRepository } from '../repositories/UserRepository.js';
import { ItemRepository } from '../repositories/ItemRepository.js';
import { PurchaseRepository } from '../repositories/PurchaseRepository.js';
import { Purchase } from '../models/Purchase.js';
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

    async purchaseItem(userId: number, itemId: number, quantity: number): Promise<number> {
        return await sql.begin(async (tx) => {
            const user = await this.userRepository.findById(userId, tx);
            if (!user) {
                throw new Error('User not found');
            }

            const item = await this.itemRepository.getById(itemId, tx);
            if (!item) {
                throw new Error('Item not found');
            }

            if (item.quantity < quantity) {
                throw new Error('Insufficient item quantity');
            }

            const totalPrice = item.suggested_price * quantity;

            if (user.balance < totalPrice) {
                throw new Error('Insufficient balance');
            }

            const newBalance = user.balance - totalPrice;
            await this.userRepository.updateBalance(userId, newBalance, tx);

            const newQuantity = item.quantity - quantity;
            await this.itemRepository.updateQuantity(itemId, newQuantity, tx);

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
