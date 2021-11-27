import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderStatus extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 128 })
  name: string;

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];
}
