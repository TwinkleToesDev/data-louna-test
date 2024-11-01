import sql from '../config/db.js';
import { User } from '../models/User.js';
import postgres, {Sql} from "postgres";

export class UserRepository {
    async findByUsername(username: string): Promise<User | null> {
        const [user] = await sql<User[]>`SELECT * FROM users WHERE username = ${username}`;
        return user || null;
    }

    async findById(userId: number, tx?: Sql, forUpdate: boolean = false): Promise<postgres.Row | null> {
        const db = tx || sql;
        let query = db`SELECT * FROM users WHERE id = ${userId}`;
        if (forUpdate) {
            query = db`SELECT * FROM users WHERE id = ${userId} FOR UPDATE`;
        }
        const [user] = await query;
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
