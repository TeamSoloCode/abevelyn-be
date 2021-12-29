import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('address')
export class Address extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column()
  addressName: string;

  @Column()
  street: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  postCode: string;

  @Column()
  companyName: string;

  @Column('bit', {
    default: true,
    transformer: {
      from: (v: Buffer) => {
        if (v instanceof Buffer) {
          return !!v?.readInt8(0);
        }
      },
      to: (v) => v,
    },
  })
  isDefaultAddress: boolean;

  @ManyToOne(() => UserProfile, (profile) => profile.addresses)
  profile: UserProfile;
}
