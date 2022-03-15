import { IsUUID } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { SignInType, UserRoles } from 'src/common/entity-enum';
import { Cart } from 'src/carts/entities/cart.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Expose } from 'class-transformer';

@Entity('user')
export class User extends RootEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  uuid: string;

  private _token: string;

  @Column({ type: 'text', name: 'token', nullable: true })
  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  private _refreshToken: string;

  @Column({ type: 'text', name: 'refreshToken', nullable: true })
  public get refreshToken(): string {
    return this._refreshToken;
  }
  public set refreshToken(value: string) {
    this._refreshToken = value;
  }

  /**
   * -----------------------------------------------------
   */

  private _username: string;

  @Index('username-idx', { fulltext: true })
  @Column({ name: 'username', unique: true, nullable: true })
  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _email: string;

  @Index('email-idx', { fulltext: true })
  @Column({ name: 'email', nullable: true, unique: true })
  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _password: string;

  @Column({ name: 'password', nullable: true })
  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _signupType: SignInType;

  @Column('enum', {
    enum: SignInType,
    default: SignInType.REGISTER,
    name: 'signupType',
  })
  public get signupType(): SignInType {
    return this._signupType;
  }

  public set signupType(value: SignInType) {
    this._signupType = value;
  }
  /**
   * -----------------------------------------------------
   */
  private _role: UserRoles;

  @Column('enum', {
    enum: UserRoles,
    default: UserRoles.USER,
    name: 'role',
  })
  public get role(): UserRoles {
    return this._role;
  }

  public set role(value: UserRoles) {
    this._role = value;
  }
  /**
   * -----------------------------------------------------
   */
  private _salt: string;

  @Column({ name: 'salt', nullable: true })
  public get salt(): string {
    return this._salt;
  }

  public set salt(value: string) {
    this._salt = value;
  }

  @OneToOne(() => UserProfile, (profile) => profile.owner, { nullable: true })
  @JoinColumn({ name: 'profileUuid' })
  profile: UserProfile;

  /**
   * -----------------------------------------------------
   */

  @OneToOne(() => Cart, (cart) => cart.owner, { onDelete: 'SET NULL' })
  carts: Cart;

  @OneToMany(() => Review, (review) => review.owner, { onDelete: 'SET NULL' })
  reviews: Review[];

  @OneToMany(() => Feedback, (feedback) => feedback.owner, {
    onDelete: 'SET NULL',
  })
  feedbacks: Feedback[];

  @OneToMany(() => Order, (order) => order.owner, { onDelete: 'SET NULL' })
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.owner)
  cartItems: CartItem[];

  @OneToMany(() => Address, (address) => address.owner)
  addresses: Address[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
