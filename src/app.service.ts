import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users/repositories/user.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    this.userRepository.signUpByGoogle({
      email: req.user.email,
      accessToken: req.user.accessToken
    });
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
