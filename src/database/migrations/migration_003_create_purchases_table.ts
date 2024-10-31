import type postgres from 'postgres';

const createPurchasesTable = `
    CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        item_id INTEGER NOT NULL REFERENCES items(id),
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW()
    );
`;

const dropPurchasesTable = `DROP TABLE IF EXISTS items;`;

export const up = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(createPurchasesTable);
};

export const down = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(dropPurchasesTable);
};
