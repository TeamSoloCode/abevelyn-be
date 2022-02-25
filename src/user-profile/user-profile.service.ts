import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common-services.service';
import ExceptionCode from 'src/exception-code';
import { User } from 'src/users/entities/user.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileRepository } from './repositories/user-profile.respository';

@Injectable()
export class UserProfileService extends CommonService<UserProfile> {
  constructor(
    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
  ) {
    super(userProfileRepository);
  }

  async create(
    createUserProfileDto: CreateUserProfileDto,
    owner: User,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      relations: ['owner'],
      where: { owner: { uuid: owner.uuid } },
    });
    if (profile) {
      throw new ConflictException('User profile already existed');
    }
    const { firstName, picture, lastName } = createUserProfileDto;
    const newProfile = new UserProfile(owner);

    newProfile.firstName = firstName;
    newProfile.lastName = lastName;
    newProfile.picture = picture;

    return this.userProfileRepository.save(newProfile);
  }

  async findProfileByOwner(owner: User): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      relations: ['owner'],
      where: { owner: { uuid: owner.uuid } },
    });

    if (profile) {
      throw new NotFoundException(ExceptionCode.USER_PROFILE.NOT_FOUND);
    }

    return profile;
  }

  async update(
    updateUserProfileDto: UpdateUserProfileDto,
    owner: User,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: {
        owner: { uuid: owner.uuid },
      },
    });

    if (!profile) {
      throw new NotFoundException(ExceptionCode.USER_PROFILE.NOT_FOUND);
    }

    const { firstName, lastName, picture, phone } = updateUserProfileDto;

    Object.assign(profile, { firstName, lastName, picture, phone });

    await this.userProfileRepository.save(profile);
    return await this.userProfileRepository.findOne(profile.uuid);
  }

  remove(id: number) {
    return `This action removes a #${id} userProfile`;
  }
}
