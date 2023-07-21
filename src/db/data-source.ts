import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.PGSQL_HOST,
  port: +process.env.PGSQL_PORT,
  username: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  database: process.env.PGSQL_NAME,
  migrationsRun: false,
  entities: ['dist/**/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.{ts,js}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
