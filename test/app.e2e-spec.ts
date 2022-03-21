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
import { Cart } from '../src/carts/entities/cart.entity';
import { CartItem } from '../src/cart-item/entities/cart-item.entity';
import { Order } from '../src/orders/entities/order.entity';
import { OrderStatus } from '../src/common/entity-enum';

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
    await dbConnection.close();
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

    const amount = 2;
    const selectedProductId = '0156f421-d727-41c7-b60e-50c3e3b82613';
    let selectedProduct: Product;
    let updatedCartItem: CartItem;
    let cartItem: CartItem;
    let myCart: Cart;
    let orderInfo: Order;

    it('Check fetching order with quantity greater than 0', async () => {
      const productsRes = await request(httpServer)
        .get(`/products/${selectedProductId}`)
        .expect(200);

      selectedProduct = productsRes.body.data;

      expect(selectedProduct).not.toBeUndefined();
      expect(selectedProduct.quantity > 0).toBeTruthy();
    });

    it('Check add new item to cart', async () => {
      myCart = await request(httpServer)
        .patch('/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: selectedProductId,
          action: 'add',
        })
        .expect(200)
        .then((res) => {
          const item: Cart = res.body.data;
          return item;
        });

      expect(myCart.uuid != undefined).toBeTruthy();
      expect(myCart.cartItems?.length > 0).toBeTruthy();

      cartItem = myCart.cartItems.find(
        (item) => item.product.uuid == selectedProductId,
      );
    });

    it('Check cart item after add new to cart', async () => {
      cartItem = await request(httpServer)
        .get(`/cart-item/${cartItem.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const item: CartItem = res.body.data;
          return item;
        });

      expect(cartItem.uuid != undefined).toBeTruthy();
    });

    it('Check cart item after update selected flag and item quantity', async () => {
      updatedCartItem = await request(httpServer)
        .patch(`/cart-item/${cartItem.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: amount,
          isSelected: true,
        })
        .expect(200)
        .then((res) => {
          const item: CartItem = res.body.data;
          return item;
        });

      expect(updatedCartItem.quantity).toBe(2);
      expect(updatedCartItem.isSelected).toBeTruthy();
    });

    it('Check preview order infor after selecte cart item to order', async () => {
      orderInfo = await request(httpServer)
        .post(`/orders/pre-order-info`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .then((res) => {
          const order: Order = res.body.data;
          return order;
        });

      expect(
        orderInfo.cartItems.find((item) => item.uuid == updatedCartItem.uuid) !=
          undefined,
      ).toBeTruthy();
    });

    it('Check create new order result', async () => {
      const newOrder = await request(httpServer)
        .post(`/orders`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .then((res) => {
          const order: Order = res.body.data;
          return order;
        });

      expect(
        newOrder.cartItems.find((item) => item.uuid == updatedCartItem.uuid) !=
          undefined,
      ).toBeTruthy();

      expect(newOrder.cartItems.find((item) => item.isSelected == false));
      expect(newOrder.status).toBe(OrderStatus.PENDING);
    });

    it('Check remain product qty after placed order', async () => {
      const remainProductQuantity = await request(httpServer)
        .get(`/products/${selectedProductId}`)
        .expect(200)
        .then((res) => {
          const product: Product = res.body.data;
          return product.quantity;
        });

      expect(remainProductQuantity).toBe(selectedProduct.quantity - amount);
    });
  });
});
