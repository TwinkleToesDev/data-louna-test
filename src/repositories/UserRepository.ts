import sql from '../config/db.js';
import { User } from '../models/User.js';
import {Sql} from "postgres";

export class UserRepository {
    async findByUsername(username: string): Promise<User | null> {
        const [user] = await sql<User[]>`SELECT * FROM users WHERE username = ${username}`;
        return user || null;
    }

    async findById(userId: number, tx?: Sql): Promise<User | null> {
        const db = tx || sql;
        const [user] = await db<User[]>`SELECT * FROM users WHERE id = ${userId}`;
        return user || null;
    }

    async updatePassword(userId: number, newPasswordHash: string): Promise<void> {
        await sql`UPDATE users SET password = ${newPasswordHash} WHERE id = ${userId}`;
    }

    async updateBalance(userId: number, newBalance: number, tx?: Sql): Promise<void> {
        const db = tx || sql;
        await db`UPDATE users SET balance = ${newBalance} WHERE id = ${userId}`;
    }
}
