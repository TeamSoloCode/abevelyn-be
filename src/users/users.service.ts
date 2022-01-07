import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { GoogleLoginResponseDTO } from 'src/auth/dto/google-login-response.dto';
import { SignInType } from 'src/common/entity-enum';
import { UserProfileService } from 'src/user-profile/user-profile.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userProfileService: UserProfileService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async loginWithGoogle(
    googleResponseDTO: GoogleLoginResponseDTO,
  ): Promise<User> {
    const { email, accessToken, firstName, lastName, picture } =
      googleResponseDTO;

    const user = await this.userRepository.findOne({
      where: { email: email, signupType: SignInType.GOOGLE },
    });

    if (user) {
      user.token = accessToken;
      return this.userRepository.save(user);
    }

    const newUser = new User();
    newUser.signupType = SignInType.GOOGLE;
    newUser.email = email;
    newUser.username = email;

    const createdUser = await this.userRepository.save(newUser);

    const profile = await this.userProfileService.create(
      { firstName, lastName, picture },
      createdUser,
    );

    createdUser.prodfile = profile;
    await this.userRepository.save(createdUser);

    return this.userRepository.findOne(createdUser.uuid);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
