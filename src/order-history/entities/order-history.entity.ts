import { classToPlain, Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { RootEntity } from '../../common/root-entity.entity';
import { Order } from '../../orders/entities/order.entity';
import {
  AfterLoad,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../../common/entity-enum';

@Entity()
export class OrderHistory extends RootEntity {
  constructor(order: Order) {
    super();
    if (order) {
      this.orderHist = JSON.stringify(classToPlain(order));
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('json', { name: 'orderAsJSON' })
  orderHist: string;

  currentStatus: OrderStatus;
  cancelReason: string;
  rejectReason: string;

  @OneToOne((type) => Order, (order) => order.orderHist)
  order: Order;

  @AfterLoad()
  updateCurrentStatus() {
    if (this.order) {
      this.currentStatus = this.order.status;
      this.updatedAt = this.order.updatedAt;
      this.cancelReason = this.order.cancelReason;
      this.rejectReason = this.order.rejectReason;
    }
  }
}
