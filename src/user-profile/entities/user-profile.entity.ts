import { IsUUID } from 'class-validator';
import { Address } from 'src/addresses/entities/address.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserProfile extends RootEntity {
  constructor(user: User) {
    super();
    this.owner = user;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 128 })
  firstName: string;

  @Column('varchar', { length: 128 })
  lastName: string;

  @Column('text')
  picture: string;

  @OneToOne(() => User, (user) => user.prodfile)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Address, (address) => address.profile)
  addresses: Address[];
}
