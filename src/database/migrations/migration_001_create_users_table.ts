import type postgres from 'postgres';

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0
    );
`;

const dropUsersTable = `DROP TABLE IF EXISTS users;`;

export const up = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(createUsersTable);
};

export const down = async (sql: postgres.Sql<any>): Promise<void> => {
    await sql.unsafe(dropUsersTable);
};
