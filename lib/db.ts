import mysql, { RowDataPacket, QueryResult } from 'mysql2/promise';

export const query = async <T>(sql: string, values?: any[]): Promise<T> => {
  const [rows] = await db.query(sql, values);
  return rows as T;
};

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mypet-db-nextjs',
});

export default db;
