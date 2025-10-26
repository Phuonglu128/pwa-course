import { test as base } from '@playwright/test';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const test = base.extend<{ db: DataSource }>({
  db: async ({}, use) => {
    const db = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await db.initialize();
    console.log('Connected to database!');
    await use(db);
    await db.destroy();
    console.log('DB connection closed.');
  },
});

export const expect = base.expect;
