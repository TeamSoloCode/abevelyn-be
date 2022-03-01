import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Product } from '../entities/product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Product;
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: Product) {
    // console.log(`AFTER ENTITY LOADED: `, entity);
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<Product>) {
    // console.log(`BEFORE ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called after entity update.
   */
  async afterUpdate(event: UpdateEvent<Product>) {
    // console.log(`AFTER ENTITY UPDATED: `, event.entity);
  }
}
