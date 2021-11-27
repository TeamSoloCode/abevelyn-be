import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class RootEntity extends BaseEntity {
  @Column('int', {
    default: 0,
    nullable: true,
  })
  sequence: number;

  @Column('bit', {
    default: true,
    transformer: { from: (v: Buffer) => !!v?.readInt8(0), to: (v) => v },
  })
  available: boolean = true;

  @Column('bit', {
    default: false,
    transformer: { from: (v: Buffer) => !!v?.readInt8(0), to: (v) => v },
  })
  deleted: boolean = false;
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
