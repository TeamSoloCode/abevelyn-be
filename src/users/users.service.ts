import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles } from 'src/entity-enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(rootUser: User, id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new NotFoundException();
      }

      if (user.uuid === rootUser.uuid) {
        throw new NotFoundException('You cannot change your role.');
      }

      if (user.role === UserRoles.ROOT) {
        throw new NotFoundException('You cannot change role of a root user.');
      }

      user.role = updateUserDto.role;
      await this.userRepository.save(user);
      return await this.userRepository.findOne(user.uuid);
    }
    catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
