import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { GoogleLoginResponseDTO } from 'src/auth/dto/google-login-response.dto';
import { SignInType } from 'src/common/entity-enum';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { CommonService } from 'src/common/common-services.service';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';

@Injectable()
export class UsersService extends CommonService<User> {
  constructor(
    private readonly userProfileService: UserProfileService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super(userRepository);
  }

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

    createdUser.profile = profile;
    await this.userRepository.save(createdUser);

    return this.userRepository.findOne(createdUser.uuid);
  }

  async updateUserRoleById(id: string, updateUserRoleDTO: UpdateUserRoleDTO) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    user.role = updateUserRoleDTO.role;

    await user.save();
    return this.userRepository.findOne(id);
  }
}
