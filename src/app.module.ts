import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [CollectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
