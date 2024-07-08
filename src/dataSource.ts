import 'dotenv/config';
import { DataSource } from 'typeorm';

import * as path from 'path';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, 'entities/*.{js,ts}')],
  subscribers: [],
  migrations: [path.join(__dirname, 'migrations/*.ts')],
});

export default dataSource;
