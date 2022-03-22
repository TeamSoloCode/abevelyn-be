import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'abevelyn_dev1',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  subscribers: [__dirname + '/../**/*.subscriber.{js,ts}'],
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
  synchronize: true,
  keepConnectionAlive: true,
  logging: ['error', 'query'],
});
