import { IsUUID } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';

export enum SignInType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  REGISTER = 'register',
}

@Entity('user')
export class User extends BaseEntity {
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
  @Column({ name: 'username', unique: true })
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
  private _salt: string;

  @Column({ name: 'salt', nullable: true })
  public get salt(): string {
    return this._salt;
  }

  public set salt(value: string) {
    this._salt = value;
  }

  @OneToOne(() => UserProfile, { nullable: true })
  @JoinColumn({ name: 'userProfileUuid' })
  userProdfile: UserProfile;

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

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
