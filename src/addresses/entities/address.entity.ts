import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('address')
export class Address extends RootEntity {
  constructor(owner: User, street: string) {
    super();

    this.street = street;
    this.owner = owner;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column({ nullable: true })
  addressName: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  provinceOrState: string;

  @Column({ nullable: true })
  ward: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postCode: string;

  @Column({ nullable: true })
  companyName: string;

  @Column('bit', {
    default: false,
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

  @ManyToOne(() => User, (user) => user.addresses)
  owner: User;
}
