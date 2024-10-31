import type postgres from 'postgres';
import { hash } from 'bcrypt';

const users = [
  {
    username: 'rich_user',
    name: 'Rich User',
    email: 'richuser@example.com',
    password: 'user123',
    balance: 150000.00
  },
  {
    username: 'user1',
    name: 'Test User',
    email: 'user1@example.com',
    password: 'user123',
    balance: 5000.00
  },
  {
    username: 'user2',
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'user123',
    balance: 7000.00
  },
  {
    username: 'user3',
    name: 'Test User 3',
    email: 'user3@example.com',
    password: 'user123',
    balance: 7000.00
  }
];

export const seed = async (sql: postgres.Sql<any>): Promise<void> => {
  for (const user of users) {
    const hashedPassword = await hash(user.password, 10);
    await sql`
      INSERT INTO users (
        username,
        name,
        email,
        password,
        balance
      ) VALUES (
        ${user.username},
        ${user.name},
        ${user.email},
        ${hashedPassword},
        ${user.balance}
      )
      ON CONFLICT (username) DO NOTHING
    `;
  }
};
