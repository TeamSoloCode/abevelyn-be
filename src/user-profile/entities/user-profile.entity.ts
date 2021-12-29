import { IsUUID } from 'class-validator';
import { Address } from 'src/addresses/entities/address.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @OneToMany(() => Address, (address) => address.profile)
  addresses: Address[];
}
