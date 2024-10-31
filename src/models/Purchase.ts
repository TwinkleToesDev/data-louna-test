export interface Purchase {
    id?: number;
    user_id: number;
    item_id: number;
    price: number;
    quantity: number;
    created_at?: Date;
}
