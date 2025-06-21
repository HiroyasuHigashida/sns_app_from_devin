import path from 'path';
import { DataSource } from 'typeorm'
import '../helpers/envLoader';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_SERVER,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: false,
  entities: isDevelopment
    ? [path.join(__dirname, '../entities/*.ts')]
    : [path.join(__dirname, '../../dist/entities/*.js')],
  migrations: isDevelopment
    ? [path.join(__dirname, './migrations/*.ts')]
    : [path.join(__dirname, '../../dist/database/migrations/*.js')],
  subscribers: [],
  charset: 'utf8mb4',
});
