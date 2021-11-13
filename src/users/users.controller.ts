import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { User } from './entities/user.entity';
import { MatchStoredTokenGuard } from 'src/auth/guards/match-token.guard';
import { AuthGuard } from '@nestjs/passport';
import { RootRoleGuard } from 'src/auth/guards/root-role.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), RootRoleGuard)
  @UsePipes(ValidationPipe)
  update(@GetUser() rootUser: User, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(rootUser, id, updateUserDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
