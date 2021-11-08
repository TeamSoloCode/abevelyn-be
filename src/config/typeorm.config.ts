import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'abevelyn_dev',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
  synchronize: true,
  logging: ['error', 'query'],
};
