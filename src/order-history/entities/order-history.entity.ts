import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderHistory extends RootEntity {
  constructor(order: Order) {
    super();
    this._order = JSON.stringify(order);
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('json', { name: 'orderAsJSON' })
  get productAsJSON(): string {
    return this._order;
  }

  set productAsJSON(orderJson: string) {
    JSON.parse(orderJson);
    this._order = orderJson;
  }

  private _order: string;

  @OneToOne((type) => Order, (order) => order.orderHistory)
  order: Order;

  getOrderHistory = (): Order => {
    if (!this._order) return undefined;
    return JSON.parse(this._order);
  };
}
