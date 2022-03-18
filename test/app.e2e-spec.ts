import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../src/products/entities/product.entity';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, QueryRunner } from 'typeorm';
import { DatabaseService } from '../src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../src/config/configuration';
import { ENV_PATH_NAME, setEnvConstants } from '../src/utils';

const root_url = 'http://localhost:3000';
let token: string = '';
let userName: string = '';

describe('abcd', () => {
  it('testing test', () => {
    expect(2 + 2).toBe(4);
  });
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let queryRunner: QueryRunner;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = app.get<DatabaseService>(DatabaseService).getDbHandle();
    queryRunner = dbConnection.createQueryRunner();
    queryRunner.startTransaction();
    httpServer = app.getHttpServer();
    app.enableCors({
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    });

    const config = app.get(ConfigService);

    setEnvConstants(config.get<IConfig>(ENV_PATH_NAME));
  });

  afterAll(async () => {
    if (queryRunner) {
      await queryRunner.rollbackTransaction();
    }

    await app.close();
  });

  describe('Place Order Testing', () => {
    beforeAll(async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({ username: 'abcdef', password: '12345' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => {
          const { username, accessToken } = res.body;
          token = accessToken;
          userName = username;
        });
    });

    it('Testing get order', async () => {
      let products: Product[] = [];

      const productsRes = await request(httpServer)
        .get('/products/fetch_available?cond=[["quantity", ">", 1]]')
        .expect(200);

      products = productsRes.body.data;
      expect(products?.length).toBeGreaterThan(0);

      products.forEach((product) => {
        console.log('abcd', product);
      });
    });
  });
});
