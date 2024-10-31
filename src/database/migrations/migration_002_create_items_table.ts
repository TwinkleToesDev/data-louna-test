import type postgres from 'postgres';

const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items
    (
        id               SERIAL PRIMARY KEY,
        market_hash_name VARCHAR(255)   NOT NULL,
        currency         VARCHAR(3)     NOT NULL,
        suggested_price  DECIMAL(10, 2),
        item_page        TEXT,
        market_page      TEXT,
        min_price        DECIMAL(10, 2),
        max_price        DECIMAL(10, 2),
        mean_price       DECIMAL(10, 2),
        quantity         INT DEFAULT 0,
        tradable         BOOLEAN DEFAULT TRUE,
        CONSTRAINT unique_market_hash_name_tradable UNIQUE (market_hash_name, tradable)
    );
`;

const dropItemsTable = `DROP TABLE IF EXISTS items;`;

export const up = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(createItemsTable);
};

export const down = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(dropItemsTable);
};
