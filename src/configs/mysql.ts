import dotenv from "dotenv";
dotenv.config();
import mysql, {Pool, PoolOptions, ResultSetHeader, RowDataPacket} from 'mysql2/promise';

const PORT: string = process.env.MYSQL_ATTN_MRI_PORT || '3316';
const poolOpt: PoolOptions = {
  host: process.env.MYSQL_ATTN_MRI_HOST,
  user: process.env.MYSQL_ATTN_MRI_USERNAME,
  password: process.env.MYSQL_ATTN_MRI_PASSWORD,
  database: process.env.MYSQL_ATTN_MRI_DB,
  port: parseInt(PORT),
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 10000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

export class MySqlDB {
  private static instance: MySqlDB;
  private pool!: Pool;

  private constructor() {}

  static getInstance(): MySqlDB {
    if(!MySqlDB.instance) {
      MySqlDB.instance = new MySqlDB();
    }

    return MySqlDB.instance;
  }

  async createPool() {
    try {
      if(!this.pool) this.pool = mysql.createPool(poolOpt);
      console.log('[INFO] MySQL connected');
      return this.pool;
    } catch (e) {
      console.error(`[ERROR] MySQL connection error: ${e}`);
      process.exit(1);
    }
  }

  async query<T=any>(sql: string, params: any[] = []): Promise<T[]> {
    if(!this.pool) throw new Error('MySQL belum terhubung');
    const [rows] = await this.pool.query<RowDataPacket[]>(sql, params);
    return rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<ResultSetHeader> {
    if(!this.pool) throw new Error('MySQL belum terhubung');
    const [result] = await this.pool.execute<ResultSetHeader>(sql, params);
    return result;
  }

  async close(): Promise<void> {
    if(this.pool) await this.pool.end(); console.log(`[INFO] Koneksi Mysql ditutup.`)
  }
}

export const mysqlService = MySqlDB.getInstance();