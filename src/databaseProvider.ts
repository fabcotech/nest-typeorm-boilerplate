import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import dataSource from './dataSource';

const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }
      return dataSource;
    },
  },
];

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
