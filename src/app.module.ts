import { Module } from '@nestjs/common';
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
import { OrderStatusModule } from './order-status/order-status.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MaterialsModule } from './materials/materials.module';
import { SizesModule } from './sizes/sizes.module';
import { ProductStatusModule } from './product-status/product-status.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
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
    OrderStatusModule,
    ReviewsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserProfileModule,
    MaterialsModule,
    SizesModule,
    ProductStatusModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
