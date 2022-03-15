import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionsModule } from './collections/collections.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currency/currency.module';
import { ColorsModule } from './colors/colors.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { CartsModule } from './carts/carts.module';
import { CouponsModule } from './coupons/coupons.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MaterialsModule } from './materials/materials.module';
import { SizesModule } from './sizes/sizes.module';
import { ProductStatusModule } from './product-status/product-status.module';
import { RolesModule } from './roles/roles.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { FileModule } from './file/file.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { AddressesModule } from './addresses/addresses.module';
import { SalesModule } from './sales/sales.module';
import { PaymentModule } from './payment/payment.module';
import { configurations } from '../config/configuration';
import { GoogleAdminStrategy } from './auth/strategies/google-admin.strategy';
import { ProductHistoryModule } from './product-history/product-history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ load: [configurations], isGlobal: true }),
    CollectionsModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    CurrencyModule,
    ColorsModule,
    FeedbacksModule,
    CartsModule,
    CouponsModule,
    OrdersModule,
    ReviewsModule,
    UserProfileModule,
    MaterialsModule,
    SizesModule,
    ProductStatusModule,
    RolesModule,
    CartItemModule,
    FileModule,
    AddressesModule,
    SalesModule,
    PaymentModule,
    ProductHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, GoogleAdminStrategy],
})
export class AppModule {}
