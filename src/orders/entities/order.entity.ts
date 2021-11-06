import { IsUUID } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderStatus } from 'src/order-status/entities/order-status.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @OneToOne(() => OrderStatus, { eager: true })
  @JoinColumn({ name: 'orderStatusUUid' })
  status: OrderStatus;

  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cartUUid' })
  cart: Cart;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ownerUUid' })
  owner: User;

  /**
   * -----------------------------------------------------
   */
  private _createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _updatedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public set updatedAt(value: Date) {
    this._updatedAt = value;
  }
}
